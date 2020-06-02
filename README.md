# Steganography.js

## Introduction

The goal of this project was to create an online steganographic tool with Javascript without using existing solutions and frameworks.

I started the project in late 2017 after being inspired by Computerphile's video about steganography:
* [Secrets Hidden in Images (Steganography) - Computerphile](https://www.youtube.com/watch?v=TWEXCYQKyDc)

## Development

This is a fairly standard project built with `create-react-app`. No custom scripts, just refer to the ˙package.json` file.

Internationalization is done with [i18next](https://www.i18next.com/). A custom script was written to build the required JSON translation file(s), which you can customize based on your backend/translation service.

To enable web workers through Webpack, I used the `worker-loader` package (imports prefixed by `!worker-loader`).

## Implementation details

The project currently uses a custom implementation of LSB steganography.

TODO: further implementation info & links

## TODOs / idea list

- [ ] new formats
    - [ ] research audio steganography
- [ ] refactor worker files
- [ ] refactor React components, update dependencies
- [ ] migrate to Typescript
- [ ] Electron/Webview app ?
- [ ] PWA ?

## Further reading - links & notes

About steganography:
* [Least Significant Bit algorithm for image steganography - International Journal of Advanced Computer Technology (IJACT)](http://ijact.org/volume3issue4/IJ0340004.pdf)

Regarding the development setup:
* [React](https://reactjs.org/docs/hello-world.html)
* [Create-react-app](https://github.com/facebookincubator/create-react-app)
* [React router](https://reacttraining.com/react-router/web/guides/quick-start)
* [Worker loader - Webpack](https://github.com/webpack-contrib/worker-loader)

Using Web Workers:
* [Worker - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Worker)
* [Worker.postMessage() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage)
* [Transferable - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Transferable)
* [ArrayBuffer - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Utilizing the HTML5 Canvas API:
* [ImageData - MDN](https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData)
    * Structure of and imgdata (ImageData) object:
        * *variable                   -> type*
        * `newImageData`             -> `ImageData`
        * `newImageData.data`        -> `Uint8ClampedArray` (`TypedArray`)
        * `nemImageData.data.buffer` -> `ArrayBuffer` (`Transferable` type!)
* [Uint8ClampedArray - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)
* [CanvasRenderingContext2D.drawImage() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)

Other:
* [FileSaver.js - eligrey](https://github.com/eligrey/FileSaver.js/)
* [image-diff-view - -a-x](https://github.com/a-x-/image-diff-view)

