// @ts-check

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
    //console.log('(encodeWorker running)');

    // Init the message array
    // Decode the transferred arrayBuffer in message.content
    // Create a view of the buffer:
    let stringView = new DataView(message.buffer, 0, message.buffer.byteLength);
    // Decode the view into a text string:
    let textDecoder = new TextDecoder("utf-8");
    let messageJSON = textDecoder.decode(stringView);
    //console.log(messageJSON)
    // Parse the decoded text into a JSON object then split into an array
    let charArray = JSON.parse(messageJSON).split("");
    // Calculate the number of iterations needed
    let length = imgData.width * imgData.height * 4;
    // Create a view (iterable array) of the transferred arrayBuffer object
    let view = new Uint8ClampedArray(imgData.buffer);
    //console.log(view)

    // Start timer
    let start = performance.now();
    self.postMessage({ progressBar: 5 });

    // Create an array based in the Unicode representation of the message's characters
    var bitPairs = [];
    charArray.map(x => {
        // Pad to 8 bits
        let byte = leftPadToByte(
            // get the Unicode value for x,
            // then convert it to binary
            x.charCodeAt(0).toString(2)
        );
        //console.log(byte, x)
        // Push to the array in 2bit parts
        bitPairs.push(byte[0] + byte[1]);
        bitPairs.push(byte[2] + byte[3]);
        bitPairs.push(byte[4] + byte[5]);
        bitPairs.push(byte[6] + byte[7]);
    });

    // Calculate the loop count
    let loopLimit = Math.min(view.length, bitPairs.length);
    // Set a logging interval
    const LOGINTERVAL = Number((loopLimit / 20).toFixed());
    // Debug 
    //console.log("view:", view.length, "bitPairs:", bitPairs.length, "loops to:", loopLimit);
    // Set new values
    for (let i = 0; i < loopLimit; i++) {
        view[i] = parseInt(
            //Convert back to decimal, and set the view value
            leftPadToByte(
                // Get the current R/G/B/A value
                view[i].toString(2)
                // Set the last to bits of the value to the message bits
            ).slice(0, 6) + bitPairs[i]
            , 2);
        //console.log("new:", view[i]);
        // More readable version: 
        /* 
        // Get the current R/G/B/A value
        let value = leftPadToByte(view[i].toString(2))
        // Get the next 2 bits of the (Unicode) message
        let char = bitPairs[i]
        // Set the last to bits of the value to the message bits
        let newValue = value.slice(0, 6) + char;
        // Convert back to decimal, and set the view value
        view[i] = parseInt(newValue, 2)
        console.log(value, char, "new:", newValue, view[i]); 
        */
        // Advance the progress bar 
        if (i % LOGINTERVAL === 0) {
            self.postMessage({ progressBar: (100 * i / loopLimit).toFixed() });
        }
    }
    // End of loop
    // End timer
    let time = (performance.now() - start).toFixed();
    //console.log('Decode function finished.');

    /* console.log(view);
    console.log(view.buffer); */
    // Transfer resulting buffer back to the main thread
    postMessage({
        done: time,
        type: "text",
        result: {
            width: imgData.width,
            height: imgData.height,
            buffer: view.buffer,
            byteLength: view.buffer.byteLength
        },
        payload: {
            byteLength: message.buffer.byteLength
        }
    }, [view.buffer]);

    // Free variables (?)

    return true;
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
    //console.log('(encodeWorker running)');

    // Create a view (iterable array) of the transferred arrayBuffer objects
    let source_view = new Uint8ClampedArray(source.buffer);
    let payload_view = new Uint8ClampedArray(payload.buffer);

    // Start timer
    let start = performance.now();

    // Create an array based in the Unicode representation of the message's characters
    var bitPairs = [];
    payload_view.map((val, i, arr) => {
        // Pad binary to 8 bits
        let byte = leftPadToByte(val.toString(2));
        // Push to the array in 2bit parts
        bitPairs.push(byte[0] + byte[1]);
        bitPairs.push(byte[2] + byte[3]);
        bitPairs.push(byte[4] + byte[5]);
        bitPairs.push(byte[6] + byte[7]);
        return null;
    });
    //console.log(bitPairs);

    // Calculate the loop count
    let loopLimit = Math.min(source.height - 1, payload.height * 2);
    // Set a logging interval
    const LOGINTERVAL = +(loopLimit / 80).toFixed() * 2;

    let w = 0, h = 0; // Chunk coordinates
    let curW = 0, curH = 0; // Pixel coordinates
    let bpIndex = 0;
    let index = 0;

    // Set new values
    // Slice into 2x2 pixel chunks
    for (let h = 0; ((h < source.height - 1) && (h < payload.height * 2)); h += 2) { // Step 2 pixels down

        //console.log("H:", h);
        curH = h * source.width * 4;
        w = 0; // Go back to the beginning of the row

        for (let w = 0; ((w < source.width - 1) && (w < payload.width * 2)); w += 2) { // Step 2 pixels right
            // Process the next 2x2 pixel block
            //console.log("w:", w);

            curW = curH + w * 4;
            //console.log(curH, curW);

            // Top left pixel
            index = curW;
            /* console.log("1. ----------- Current index:", index, " - ", index + 3);
            console.log("Old pixel:",
                [source_view[index], source_view[index + 1],
                source_view[index + 2], source_view[index + 3]]
            ); */
            for (let i = 0; i < 4; i++) {
                source_view[index + i] = swapTwoLSB(source_view[index + i], bitPairs[bpIndex]);
                bpIndex++;
            }
            /* console.log("New pixel:",
                [source_view[index], source_view[index + 1],
                source_view[index + 2], source_view[index + 3]]
            );
            console.log("%c                      ", ` background-color: rgba(
                ${source_view[index]},
                ${source_view[index + 1]},
                ${source_view[index + 2]},
                ${source_view[index + 3]}
            )`); */

            // Top right pixel
            index = curW + 4;
            /* console.log("2. ----------- Current index:", index, " - ", index + 3);
            console.log("Old pixel:",
                [source_view[index], source_view[index + 1],
                source_view[index + 2], source_view[index + 3]]
            ); */
            for (let i = 0; i < 4; i++) {
                source_view[index + i] = swapTwoLSB(source_view[index + i], bitPairs[bpIndex]);
                bpIndex++;
            }
            /* console.log("New pixel:",
                [source_view[index], source_view[index + 1],
                source_view[index + 2], source_view[index + 3]]
            ); */
            /* console.log("%c                      ", ` background-color: rgba(
                ${source_view[index]},
                ${source_view[index + 1]},
                ${source_view[index + 2]},
                ${source_view[index + 3]}
            )`); */

            // Bottom left pixel
            index = (source.width * 4) + curW;
            /* console.log("3. ----------- Current index:", index, " - ", index + 3);
            console.log("Old pixel:",
                [source_view[index], source_view[index + 1],
                source_view[index + 2], source_view[index + 3]]
            ); */
            for (let i = 0; i < 4; i++) {
                source_view[index + i] = swapTwoLSB(source_view[index + i], bitPairs[bpIndex]);
                bpIndex++;
            }
            /* console.log("New pixel:",
                [source_view[index], source_view[index + 1],
                source_view[index + 2], source_view[index + 3]]
            );
            console.log("%c                      ", ` background-color: rgba(
                ${source_view[index]},
                ${source_view[index + 1]},
                ${source_view[index + 2]},
                ${source_view[index + 3]}
            )`); */

            // Bottom right pixel
            index = (source.width * 4) + curW + 4;
            /* console.log("4. ----------- Current index:", index, " - ", index + 3);
            console.log("Old pixel:",
                [source_view[index], source_view[index + 1],
                source_view[index + 2], source_view[index + 3]]
            ); */
            for (let i = 0; i < 4; i++) {
                source_view[index + i] = swapTwoLSB(source_view[index + i], bitPairs[bpIndex]);
                bpIndex++;
            }
            /* console.log("New pixel:",
                [source_view[index], source_view[index + 1],
                source_view[index + 2], source_view[index + 3]]
            );
            console.log("%c                      ", ` background-color: rgba(
                ${source_view[index]},
                ${source_view[index + 1]},
                ${source_view[index + 2]},
                ${source_view[index + 3]}
            )`); */
        }

        // Advance the progress bar
        if (h % LOGINTERVAL === 0) {
            self.postMessage({ progressBar: (100 * h / loopLimit).toFixed() });
        }
    }
    // End of loop

    // End timer
    let time = (performance.now() - start).toFixed();

    // Transfer resulting buffer back to the main thread
    postMessage({
        done: time,
        type: "image",
        result: {
            width: source.width,
            height: source.height,
            buffer: source_view.buffer,
            byteLength: source_view.buffer.byteLength
        },
        payload: {
            byteLength: payload.buffer.byteLength
        },
    }, [source_view.buffer]);

    // Free variables (?)

    return true;
}




/**
 * Pad binary number with zeros to 1 byte
 * 
 * @param {string} number to left pad
 * @returns {string} padded number
 */
function leftPadToByte(number) {
    while (number.length < 8) { number = '0' + number; }
    return number;
}




/**
 * Swap the last two bits of the source number with the provided 2bit message. 
 * 
 * @param {number} decimalSource to perform function on
 * @param {string} message to encode
 * @returns {number}
 */
function swapTwoLSB(decimalSource, message) {
    let binarySource = leftPadToByte(decimalSource.toString(2));
    let binaryResult = binarySource.slice(0, 6) + message[0] + message[1];
    let decimalResult = parseInt(binaryResult, 2);
    //console.log(binarySource + " + " + message + " = " + binaryResult, decimalResult);
    return decimalResult;
}




/**
 * Handle messages coming from the main thread
 * @param {object} e event data
 * @param {array} transferList of ArrayBuffers
 */
function handler(e, transferList) {
    /**
     * transferList (from MDN)
     * 
     * An optional array of Transferable objects to transfer ownership of. 
     * If the ownership of an object is transferred, it becomes 
     * unusable (neutered) in the context it was sent from 
     * and becomes available only to the worker it was sent to.
     * 
     * Transferable objects are instances of classes like ArrayBuffer, 
     * MessagePort or ImageBitmap objects can be transferred. 
     * null is not an acceptable value for the transferList.
     * 
     * NOTE:
     * This property is not accessible directly.
     */

    if (e.data) {
        //console.log(e.data)
        if (e.data.mode == "text") {
            encodeText(e.data.image, e.data.payload);
        } else if (e.data.mode == "image") {
            encodeImage(e.data.image, e.data.payload);
        }
        return;
    }
};
self.onmessage = handler;
