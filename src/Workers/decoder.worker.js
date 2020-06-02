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
  //console.log("(decodeWorker running)");

  // Start timer
  let start = performance.now();
  postMessage({ progressBar: 5 });

  // Init the result array
  let charArray = [];
  // Calculate the number of iterations needed
  let length = imgData.buffer.byteLength ||
    (imgData.width * imgData.height * 4);
  // Set a logging interval
  const LOGINTERVAL = (length) / 30;
  // Create a view (iterable array) of the transferred arrayBuffer object
  let view = new Uint8ClampedArray(imgData.buffer);
  //console.log(view)

  // Loop through the entire view
  for (let i = 0; i < length; i += 4) {
    // Get pixel data as 4 * 8bits
    // (1 pixel = RGBA => every 4 elements of the array)
    let pixel = [
      leftPadToByte((view[i]).toString(2)),
      leftPadToByte((view[i + 1]).toString(2)),
      leftPadToByte((view[i + 2]).toString(2)),
      leftPadToByte((view[i + 3]).toString(2)),
    ];
    // Concatenate the last 2 bits of every RGBA component's value into a byte
    let byte = pixel[0].slice(-2) +
      pixel[1].slice(-2) +
      pixel[2].slice(-2) +
      pixel[3].slice(-2);
    // Convert this byte to a decimal to get the Unicode representation
    let unicode = parseInt(byte, 2);
    // Get the character from the Unicode representation
    let char = String.fromCharCode(unicode);
    // Push it to the result array
    charArray.push(char);

    // Advance the progress bar between 5-95:
    if (i % LOGINTERVAL === 0) {
      self.postMessage({ progressBar: 5 + (90 * (i / length).toFixed(1)) });
    }
  }
  // End of loop

  // End timer
  let time = (performance.now() - start).toFixed();
  //console.log("Decode function finished.");

  // Transfer resulting charArray back to the main thread
  let string = JSON.stringify(charArray);
  let uint8_array = new TextEncoder(/* document.characterSet.toLowerCase() */)
    .encode(string);
  let array_buffer = uint8_array.buffer;
  // Transfer resulting arrayBuffer back to the main thread
  self.postMessage({
    done: time,
    type: "text",
    result: {
      buffer: array_buffer,
      byteLength: array_buffer.byteLength,
    },
    payload: {
      byteLength: imgData.buffer.byteLength,
    },
  }, [array_buffer]);

  // Free variables (?)

  return true;
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
  //console.log("(decodeWorker running)")

  // Start timer
  let start = performance.now();
  self.postMessage({ progressBar: 5 });

  // Calculate the number of iterations needed
  let length = imgData.buffer.byteLength;
  // Init the result array
  let newWidth = Math.floor(imgData.width / 2);
  let newHeight = Math.floor(imgData.height / 2);
  let newImgData = new ImageData(newWidth, newHeight);
  //console.log(imgData.width, imgData.height, newWidth, newHeight);
  // Set a logging interval
  const LOGINTERVAL = Number((imgData.height / 20).toFixed());
  // Create a view (iterable array) of the transferred arrayBuffer object
  let view = new Uint8ClampedArray(imgData.buffer);
  //console.log(view)

  let w = 0, h = 0; // Chunk coordinates
  let curW = 0, curH = 0; // Pixel coordinates
  let newIndex = 0;

  // Slice into 2x2 pixel chunks
  for (let h = 0; h < imgData.height - 1; h += 2) { // Step 2 pixels down
    //console.log("");
    //console.log("H:", h);
    curH = h * imgData.width * 4;
    w = 0; // Go back to the beginning of the row
    for (let w = 0; w < imgData.width - 1; w += 2) { // Step 2 pixels right
      //console.log("w:", w);
      curW = curH + w * 4;
      //console.log(curH, curW);
      // Process the next 2x2 pixel block
      // Top left pixel
      newImgData.data[newIndex] = decodePixelFromChunk([
        view[curW + 0],
        view[curW + 1],
        view[curW + 2],
        view[curW + 3],
      ]);
      newIndex++;
      // Top right pixel
      newImgData.data[newIndex] = decodePixelFromChunk([
        view[curW + 4],
        view[curW + 5],
        view[curW + 6],
        view[curW + 7],
      ]);
      newIndex++;
      // Bottom left pixel
      newImgData.data[newIndex] = decodePixelFromChunk([
        view[(imgData.width * 4) + curW + 0],
        view[(imgData.width * 4) + curW + 1],
        view[(imgData.width * 4) + curW + 2],
        view[(imgData.width * 4) + curW + 3],
      ]);
      newIndex++;
      // Bottom right pixel
      newImgData.data[newIndex] = decodePixelFromChunk([
        view[(imgData.width * 4) + curW + 4],
        view[(imgData.width * 4) + curW + 5],
        view[(imgData.width * 4) + curW + 6],
        view[(imgData.width * 4) + curW + 7],
      ]);
      newIndex++;
      // Debug process - only for small images!
      /* console.log("New pixel:", ` ${newImgData.data[newIndex - 4]},
            ${newImgData.data[newIndex - 3]},
            ${newImgData.data[newIndex - 2]},
            ${newImgData.data[newIndex - 1]}`);
            console.log("%c                      ", ` background-color: rgba(
                ${newImgData.data[newIndex - 4]},
                ${newImgData.data[newIndex - 3]},
                ${newImgData.data[newIndex - 2]},
                ${newImgData.data[newIndex - 1]}
            `); */
    }
    // Advance the progress bar
    if (h % LOGINTERVAL === 0) {
      postMessage({ progressBar: (100 * h / imgData.height).toFixed() });
    }
  }

  // End of loop
  // End timer
  let time = (performance.now() - start).toFixed();
  //console.log("Decode function finished.");

  //console.log(newImgData, newImgData.data, newImgData.data.buffer)
  // Create an arrayBuffer from the new ImageData object
  let array_buffer = newImgData.data.buffer;
  // Transfer resulting arrayBuffer back to the main thread
  postMessage({
    done: time,
    type: "image",
    result: {
      width: newWidth,
      height: newHeight,
      buffer: array_buffer,
      byteLength: array_buffer.byteLength,
    },
    payload: {
      byteLength: imgData.buffer.byteLength,
    },
  }, [array_buffer]);

  // Free variables (?)

  return true;
}

/**
 * Pad binary number with zeros to 1 byte
 * @param {string} number to left pad
 * @returns {string} padded binary number
 */
function leftPadToByte(number) {
  while (number.length < 8) number = "0" + number;
  return number;
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
function decodePixelFromChunk(chunk) {
  // Get pixel data as 4 * 8bits
  // (1 pixel = RGBA => every 4 elements of the array)
  let pixel = [
    leftPadToByte((chunk[0]).toString(2)),
    leftPadToByte((chunk[1]).toString(2)),
    leftPadToByte((chunk[2]).toString(2)),
    leftPadToByte((chunk[3]).toString(2)),
  ];
  // Concatenate the last 2 bits of every RGBA component's value into a byte
  let byte = pixel[0].slice(-2) +
    pixel[1].slice(-2) +
    pixel[2].slice(-2) +
    pixel[3].slice(-2);
  let decimal = parseInt(byte, 2);
  // Debug process - only for small images!
  /* console.log("%c      ", ` background-color: rgba(${chunk[0]},${chunk[1]},${chunk[2]},${chunk[3]}`);
    console.log(chunk);
    console.log("pix:", pixel);
    console.log("byte:", byte, "decimal:", decimal); */
  // Convert this byte to a decimal to store as an R/G/B/A value of the new image data
  return decimal;
}

/**
 * Handle messages coming from the main thread
 * @param {object} e event data
 * @param {array} transferList of ArrayBuffers
 */
function handler(e, transferList) {
  /**
     * About the transferList parameter: 
     * 
     * An optional array of Transferable objects to transfer ownership of. 
     * The Transferable interface represents an object that can be transfered 
     * between different execution contexts, like the main thread and Web workers.
     * 
     * If the ownership of an object is transferred, it becomes 
     * unusable (neutered) in the context it was sent from 
     * and becomes available only to the worker it was sent to.
     * 
     * Transferable objects are instances of classes like ArrayBuffer, 
     * MessagePort or ImageBitmap.
     * null is not an acceptable value for the transferList.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
     * https://developer.mozilla.org/en-US/docs/Web/API/Transferable
     */

  if (e.data) {
    //console.log(e.data)
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
