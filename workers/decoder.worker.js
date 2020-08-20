// @ts-nocheck
// eslint-disable

const LOG_FREQUENCY = 50;

Uint8ClampedArray.prototype.getChunk = function(start, size = 4) {
    const result = [];
    for (let i = 0; i < size; i++) {
        result.push(this[start + i]);
    }
    return result;
};

/**
* Pad binary number with zeros to 1 byte
* @param {string} number to left pad
* @returns {string}
*/
function leftPadToByte(number) {
    return number.padStart(8, "0");
}

/**
* Process an RGBA pixel:
* 1. get the last two bits of each byte (4 * 2 bits),
* 2. concatenate them into a byte (1 byte),
* 3. parse this byte into a decimal and return it.
* 
* @param {number[]} chunk of 4 pixels to decode
* @returns {number} resultPixel
*/
function getDataFromPixel(chunk) {
    // Get pixel data as 4 * 8bits
    // (1 pixel = RGBA => every 4 elements of the array)
    const pixel = [
        leftPadToByte((chunk[0]).toString(2)),
        leftPadToByte((chunk[1]).toString(2)),
        leftPadToByte((chunk[2]).toString(2)),
        leftPadToByte((chunk[3]).toString(2)),
    ];
    // Concatenate the last 2 bits of every RGBA component's value into a byte
    const byte = pixel[0].slice(-2) +
        pixel[1].slice(-2) +
        pixel[2].slice(-2) +
        pixel[3].slice(-2);

    // Convert this byte to a decimal to get the Unicode representation
    return parseInt(byte, 2);
}

/**
* Steganographic decoder function running in a Web Worker (separate thread).
* 
* Recives a transferred arrayBuffer object from the main thread and performs the following operations:
* 
* 1. Create a View of the arrayBuffer.
* 2. Loop through the view with increments of 4.
* 3. For each 4 elements, convert the RGBA values into binary (4 * 8 bits per loop).
*      * get the last two bits of each byte (4 * 2 bits per loop).
*      * concatenate them into a byte (1 byte per loop).
*      * parse this byte into a decimal, then get the correspong Unicode character (1 char per loop).
* 4. Push all resulting characters into an array, and transfer the array back to the main thread.
* 
* @param {{buffer: ArrayBuffer, width: number, height: number}} imgData of the transferred object
*/
function decodeText(imgData) {
    const progressThreshold = (imgData.buffer.byteLength / LOG_FREQUENCY).toFixed();
    const start = performance.now();
    postMessage({ progressBar: 0 });

    const charArray = [];
    const view = new Uint8ClampedArray(imgData.buffer);

    const length = (imgData.height * imgData.width) * 4;
    for (let i = 0; i < length; i += 4) {
        // Get pixel data as 4 * 8bits
        // (1 pixel = RGBA => every 4 elements of the array)
        const pixel = [
            view[i],
            view[i + 1],
            view[i + 2],
            view[i + 3],
        ];
        // Get the character from the Unicode representation
        const char = String.fromCharCode(getDataFromPixel(pixel));
        charArray.push(char);
        // Advance the progress bar between 5-95
        if (i % progressThreshold === 0) {
            self.postMessage({
                progressBar: ((i / length) * 100).toFixed(1),
            });
        }
    }

    const time = (performance.now() - start).toFixed();
    const string = JSON.stringify(charArray);
    const bytes = new TextEncoder().encode(string);

    // Transfer resulting arrayBuffer back to the main thread
    self.postMessage({
        done: time,
        type: "text",
        result: {
            buffer: bytes.buffer,
            byteLength: bytes.buffer.byteLength,
        },
        payload: {
            byteLength: imgData.buffer.byteLength,
        },
    }, [bytes.buffer]);
}

/**
* Steganographic decoder function running in a Web Worker (separate thread).
* 
* Recives a transferred arrayBuffer object from the main thread and performs the following operations:
* 
* 1. Create a View of the arrayBuffer.
* 2. Loop through the view and create 2x2 pixel chunks.
* 3. Process each chunk of pixels:
*      * convert the RGBA values into binary (4 * 8 bits per loop).
*      * get the last two bits of each byte (4 * 2 bits per loop).
*      * concatenate them into a byte (1 byte per loop).
*      * (4x creates and RGBA pixel)
* 4. Push all bytes into an arrayBuffer
* 5. Transfer the resulting arrayBuffer back to the main thread
* 
* @param {{buffer: ArrayBuffer, width: number, height: number}} imgData of the transferred object
*/
function decodeImage(imgData) {
    const progressThreshold = (imgData.height / LOG_FREQUENCY).toFixed();
    const start = performance.now();
    self.postMessage({ progressBar: 0 });

    const newWidth = Math.floor(imgData.width / 2);
    const newHeight = Math.floor(imgData.height / 2);
    const newImgData = new ImageData(newWidth, newHeight);
    const view = new Uint8ClampedArray(imgData.buffer);

    let curW = 0;
    let curH = 0;
    let newIndex = 0;

    // Slice into 2x2 pixel chunks
    for (let h = 0; h < imgData.height - 1; h += 2) { // Step 2 pixels down
        curH = h * imgData.width * 4;
        w = 0; // Go back to the beginning of the row
        for (let w = 0; w < imgData.width - 1; w += 2) { // Step 2 pixels right
            curW = curH + w * 4;
            // Process the next 2x2 pixel block
            // Top left pixel
            newImgData.data[newIndex] = getDataFromPixel(
                view.getChunk(curW),
            );
            newIndex++;
            // Top right pixel
            newImgData.data[newIndex] = getDataFromPixel(
                view.getChunk(curW + 4),
            );
            newIndex++;
            // Bottom left pixel
            newImgData.data[newIndex] = getDataFromPixel(
                view.getChunk((imgData.width * 4) + curW),
            );
            newIndex++;
            // Bottom right pixel
            newImgData.data[newIndex] = getDataFromPixel(
                view.getChunk((imgData.width * 4) + curW + 4),
            );
            newIndex++;
        }
        // Advance the progress bar between 5-95
        if (h % progressThreshold === 0) {
            self.postMessage({
                progressBar: ((h / imgData.height) * 100).toFixed(1),
            });
        }
    }

    const time = (performance.now() - start).toFixed();
    const bytes = newImgData.data.buffer;

    // Transfer resulting arrayBuffer back to the main thread
    postMessage({
        done: time,
        type: "image",
        result: {
            width: newWidth,
            height: newHeight,
            buffer: bytes,
            byteLength: bytes.byteLength,
        },
        payload: {
            byteLength: imgData.buffer.byteLength,
        },
    }, [bytes]);
}

/**
* Handle messages coming from the main thread
* @param {object} e event data
* @param {array} transferList of ArrayBuffers
*/
function handler(e, transferList) {
    if (e.data) {
        if (e.data.mode === "image") {
            decodeImage(e.data.image);
        } else if (e.data.mode === "text") {
            decodeText(e.data.image);
        } else {
            console.error("No compatible process type found.");
        }
        return;
    }
}
self.onmessage = handler;
