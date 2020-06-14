import React from "react";

export default function Info() {
    return (
        <div>
            <div className="App-content pad-top">
                <div className="how">
                    <div className="row">
                        <div className="col s12 m6">
                            <h4>What is steganography?</h4>
                            <blockquote>
                                <strong>Steganography</strong>
                                is the practice of concealing a file, message, image, or video
                                within another file, message, image, or video.
                            </blockquote>
                            <p>
                                The advantage of steganography over cryptography alone is that
                                the intended secret message does not attract attention to itself
                                as an object of scrutiny. Plainly visible encrypted messages —
                                no matter how unbreakable — arouse interest, and may in
                                themselves be incriminating in countries where encryption is
                                illegal. Thus, whereas cryptography is the practice of
                                protecting the contents of a message alone, steganography is
                                concerned with <strong> concealing the fact that a secret message is being sent at all </strong>, as well as concealing the contents of the message.
                            </p>
                        </div>

                        <div className="col s12 m6">
                            <h4>Digital steganography</h4>
                            <p>
                                Steganography includes the concealment of information within computer files. In <strong>digital steganography</strong>, electronic communications may include steganographic coding inside of a transport layer, such as a document file,  image file, program or protocol. <strong>Media files</strong> are ideal for steganographic transmission because of their large size.
                            </p>
                            <p>
                                For example, a sender might start with an innocuous image file
                                and adjust the color of every 100th pixel to correspond to a
                                letter in the alphabet, a change so subtle that someone not
                                specifically looking for it is unlikely to notice it.
                            </p>
                            <p>
                                Read below about this application's implementation of digital
                                steganography.
                            </p>
                            <p>
                                <small>
                                    source: <strong>
                                        <a
                                            href="https://en.wikipedia.org/wiki/Steganography"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            WikiPedia
                                    </a>
                                    </strong>
                                </small>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="how">
                    <h4>How is it done?</h4>
                    <p>
                        This section covers the process of encoding and decoding text from a
                        steganograpic image.
                    </p>
                    <div className="row">
                        <div className="col s12 m6">
                            <h5 className="section-title">
                                Decoding
                                <small>- reading the hidden data</small>
                            </h5>

                            <strong>Step 1:</strong>
                            <p>
                                We draw the selected image to a canvas (sometimes in the
                                background), then read it pixel-by-pixel. Each pixel is stored as an array of four 8bit values: <em>red, green, blue and alpha (transparency)</em> respectively.
                            </p>
                            <pre><code>{`[125, 48, 210, 255]`}</code></pre>

                            <strong>Step 2:</strong>
                            <p>
                                These values are then converted to binary.
                            </p>
                            <pre>
                                <code>{`[01111101, 00110000, 11010010, 11111111]`}</code>
                            </pre>

                            <strong>Step 3:</strong>
                            <p>
                                We extract the steganographic, <em>hidden</em> data by taking the last 2 bits of every byte of each pixel.
                            </p>
                            <pre>
                                <code>
                                    {`[01111101, 00110000, 11010010, 11111111]`}
                                    <br />
                                    {`[      01,       00,       10,       11]`}
                                </code>
                            </pre>

                            <strong>Step 4:</strong>
                            <p>
                                The two least significant, steganographic bits are concatenated
                                in pairs of 4 into 1 bytes each.
                            </p>
                            <pre>
                                <code>{`[...01, ...00, ...10, ...11]`} => 01001011</code>
                            </pre>

                            <strong>Step 5:</strong>
                            <p>
                                Finally, the bytes are cast to integers, then converted to the
                                appropriate ASCII characters, revealing the steganographic data
                                hidden in the image (if there is any).
                            </p>
                            <pre><code>01001011 => 075 => K</code></pre>
                        </div>

                        <div className="col s12 m6">
                            <h5 className="section-title">
                                Encoding
                                <small>- hiding your own data</small>
                            </h5>

                            <strong>Step 1:</strong>
                            <p>
                                Each character of the message is converted to the ASCII number
                                representation of it, then cast to a single byte.
                            </p>
                            <pre><code>a => 097 => 01100001</code></pre>

                            <strong>Step 2:</strong>
                            <p>
                                Each byte is cut into 4*2 bits
                            </p>
                            <pre><code>01100001 => {`01, 10, 00, 01`}</code></pre>

                            <strong>Step 3:</strong>
                            <p>
                                During the decoding proccess, we stored the 8bit representation
                                of the rgba data of each pixel in the original image to avoid
                                parsing it twice. The bit-pairs from the last step replace the
                                last two bits of every byte in the original image.
                            </p>
                            <pre>
                                <code>
                                    original: {`01111101, 00110000, 11010010, 11111111`}
                                    <br />message: {`      01,       10,       00,       01`}
                                    <br />new: {`01111101, 00110010, 11010000, 11111101`}
                                </code>
                            </pre>

                            <strong>Step 4:</strong>
                            <p>
                                The new byte data (with the message injected) is cast to
                                the <em>red, green, blue and alpha</em> channels' integer values. The resulting objects can then be drawn onto the canvas as pixels of the new, steganographic image.
                            </p>
                            <pre><code>{`[125, 50, 208, 253]`}</code></pre>

                            <strong>Note:</strong>
                            <p>
                                Comparing a pixel from the original image with the same pixel
                                injected with one character of the secret message, we can see
                                that the rgb color and alpha values have not changed
                                drastically. This change is mostly undetectable by the human
                                eye.
                            </p>
                            <pre>
                                <code>
                                    original: <div className="pixel" id="p1"></div>
                                    {`[125, 48, 210, 255]`}
                                    <br />new: <div className="pixel" id="p2"></div>
                                    {`[125, 50, 208, 253]`}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
