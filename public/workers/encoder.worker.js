// @ts-nocheck
// eslint-disable

const LOG_FREQUENCY = 50;

/**
 * Pad binary number with zeros to 1 byte
 * 
 * @param {string} number to left pad
 * @returns {string}
 */
function leftPadToByte(number) {
    return number.padStart(8, "0");
}

/**
 * Swap the last two bits of the source number with the provided 2bit message. 
 * 
 * @param {number} decimalSource to perform function on
 * @param {string} message to encode
 * @returns {number}
 */
function swapTwoLSB(decimalSource, message) {
    const binarySource = leftPadToByte(decimalSource.toString(2));
    const binaryResult = binarySource.slice(0, 6) + message[0] + message[1];
    const decimalResult = parseInt(binaryResult, 2);
    return decimalResult;
}

/**
 * Steganographic encoder function running in a Web Worker (separate thread).
 * 
 * Recives a message string and a transferred arrayBuffer object from the main thread 
 * and performs the following operations:
 * 
 * 1. Create a View of the arrayBuffer to make changes on
 * 2. Map the message string to a byte array
 * 3. Loop through the View, and for each element:
 *      * get the current RGBA values
 *      * for each value:
 *          * convert to binary
 *          * swap the last 2 bits with the next 2 bits of the message
 *          * convert back to decimal
 * 4. Transfer the arrayBuffer back to the main thread
 * 
 * @param {{buffer: ArrayBuffer, width: number, height: number}} imgData of the transferred object
 * @param {{buffer: ArrayBuffer, length: [number]}} message containing the  string to encode into the image
 */
function encodeText(imgData, message) {
    const start = performance.now();
    self.postMessage({ progressBar: 0 });

    const stringView = new DataView(message.buffer, 0, message.buffer.byteLength);
    const textDecoder = new TextDecoder("utf-8");
    const messageJSON = textDecoder.decode(stringView);
    // Parse the decoded text into a JSON object then split into an array
    const charArray = JSON.parse(messageJSON).split("");
    // Create a view (iterable array) of the transferred arrayBuffer object
    const view = new Uint8ClampedArray(imgData.buffer);

    // Create an array based in the Unicode representation of the message's characters
    const bitPairs = [];
    charArray.map((x) => {
        // Pad to 8 bits
        const byte = leftPadToByte(
            // Get the Unicode value for x, then convert it to binary
            x.charCodeAt(0).toString(2),
        );
        // Push to the array in 2bit parts
        bitPairs.push(byte[0] + byte[1]);
        bitPairs.push(byte[2] + byte[3]);
        bitPairs.push(byte[4] + byte[5]);
        bitPairs.push(byte[6] + byte[7]);
    });

    // Calculate the loop count
    const loopLimit = Math.min(view.length, bitPairs.length);
    const LOGINTERVAL = (loopLimit / LOG_FREQUENCY).toFixed();

    // Set new values
    for (let i = 0; i < loopLimit; i++) {
        view[i] = parseInt(
            //Convert back to decimal, and set the view value
            leftPadToByte(
                // Get the current R/G/B/A value
                view[i].toString(2),
                // Set the last to bits of the value to the message bits
            ).slice(0, 6) + bitPairs[i],
            2,
        );
        if (i % LOGINTERVAL === 0) {
            self.postMessage({ progressBar: (100 * i / loopLimit).toFixed(1) });
        }
    }
    const time = (performance.now() - start).toFixed();

    // Transfer resulting buffer back to the main thread
    postMessage({
        done: time,
        type: "text",
        result: {
            width: imgData.width,
            height: imgData.height,
            buffer: view.buffer,
            byteLength: view.buffer.byteLength,
        },
        payload: {
            byteLength: message.buffer.byteLength,
        },
    }, [view.buffer]);
}

/**
 * Steganographic encoder function running in a Web Worker (separate thread).
 * 
 * Recives two transferred arrayBuffer objects from the main thread 
 * and performs the following operations:
 * 
 * 1. Create a View of the arrayBuffer to make changes on
 * 2. Create a View of the message buffer
 * 3. Process the source view in 2x2 pixel chunks
 * 4. Loop through the chunks, and for each element of them:
 *      * get the current RGBA values
 *      * for each value:
 *          * convert to binary
 *          * swap the last 2 bits with the next 2 bits of the message
 *          * convert back to decimal
 * 5. Transfer the arrayBuffer back to the main thread
 * 
 * @param {{buffer: ArrayBuffer, width: number, height: number}} source of the transferred object
 * @param {{buffer: ArrayBuffer, width: number, height: number}} payload of the transferred object
 */
function encodeImage(source, payload) {
    const start = performance.now();
    self.postMessage({ progressBar: 0 });

    // Create a view (iterable array) of the transferred arrayBuffer objects
    const source_view = new Uint8ClampedArray(source.buffer);
    const payload_view = new Uint8ClampedArray(payload.buffer);

    const bitPairs = [];
    payload_view.map((val, i, arr) => {
        // Pad binary to 8 bits
        const byte = leftPadToByte(val.toString(2));
        // Push to the array in 2bit parts
        bitPairs.push(byte[0] + byte[1]);
        bitPairs.push(byte[2] + byte[3]);
        bitPairs.push(byte[4] + byte[5]);
        bitPairs.push(byte[6] + byte[7]);
        return null;
    });

    // Calculate the loop count
    const loopLimit = Math.min(source.height - 1, payload.height * 2);
    const LOGINTERVAL = (loopLimit / LOG_FREQUENCY).toFixed() * 2;

    let bpIndex = 0;
    let index = 0;
    let curW = 0;
    let curH = 0; // Pixel coordinates

    // Set new values
    // Slice into 2x2 pixel chunks
    for (
        let h = 0;
        ((h < source.height - 1) && (h < payload.height * 2));
        h += 2
    ) { // Step 2 pixels down
        curH = h * source.width * 4;

        for (
            let w = 0;
            ((w < source.width - 1) && (w < payload.width * 2));
            w += 2
        ) { // Step 2 pixels right
            curW = curH + w * 4;

            // Top left pixel
            index = curW;
            for (let i = 0; i < 4; i++) {
                source_view[index + i] = swapTwoLSB(
                    source_view[index + i],
                    bitPairs[bpIndex],
                );
                bpIndex++;
            }
            // Top right pixel
            index = curW + 4;
            for (let i = 0; i < 4; i++) {
                source_view[index + i] = swapTwoLSB(
                    source_view[index + i],
                    bitPairs[bpIndex],
                );
                bpIndex++;
            }
            // Bottom left pixel
            index = (source.width * 4) + curW;
            for (let i = 0; i < 4; i++) {
                source_view[index + i] = swapTwoLSB(
                    source_view[index + i],
                    bitPairs[bpIndex],
                );
                bpIndex++;
            }
            // Bottom right pixel
            index = (source.width * 4) + curW + 4;
            for (let i = 0; i < 4; i++) {
                source_view[index + i] = swapTwoLSB(
                    source_view[index + i],
                    bitPairs[bpIndex],
                );
                bpIndex++;
            }
        }

        if (h % LOGINTERVAL === 0) {
            self.postMessage({ progressBar: (100 * h / loopLimit).toFixed(1) });
        }
    }

    const time = (performance.now() - start).toFixed();

    // Transfer resulting buffer back to the main thread
    postMessage({
        done: time,
        type: "image",
        result: {
            width: source.width,
            height: source.height,
            buffer: source_view.buffer,
            byteLength: source_view.buffer.byteLength,
        },
        payload: {
            byteLength: payload.buffer.byteLength,
        },
    }, [source_view.buffer]);
}

/**
 * Handle messages coming from the main thread
 * @param {object} e event data
 * @param {array} transferList of ArrayBuffers
 */
function handler(e, transferList) {
    if (e.data) {
        if (e.data.mode == "text") {
            encodeText(e.data.image, e.data.payload);
        } else if (e.data.mode == "image") {
            encodeImage(e.data.image, e.data.payload);
        } else {
            console.error("No compatible process type found.");
        }
        return;
    }
}
self.onmessage = handler;
