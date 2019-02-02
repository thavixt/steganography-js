# Steganography.js

## Introduction

The goal of this project was to create an online steganographic tool with Javascript without using existing solutions and frameworks.

I started the project in late 2017 after being inspired by Computerphile's video about steganography:
* [Secrets Hidden in Images (Steganography) - Computerphile](https://www.youtube.com/watch?v=TWEXCYQKyDc)

## Usage

TODO

## Implementation details

The project currently uses a custom implementation of LSB steganography.

TODO

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
* [Funnies - 1egoman](https://github.com/1egoman/funnies)
* [image-diff-view - -a-x](https://github.com/a-x-/image-diff-view)

## React tips & tricks

### Changing component routes without a redirect

1. Use `render` instead of `component` in `<Route/>`s:

    ```jsx
    // instead of:
    <Route path="/home" component={Home} />
    // use 'render':
    <Route path="/home" render={() => <Home {...props} {...historyProps} />} />
    ```

    This way, React will pass down `history` in the component's `props`, so you can use all it's functions inside the Route.

    [render: func (docs)](https://reacttraining.com/react-router/web/api/Route/render-func)

2. Create an instance of `history/createBrowserHistory` and use `history.push('/route')` to change routes:

    ```jsx
    // createBrowserHistory is for use in modern web browsers
    // that support the HTML5 history API
    import createHistory from "history/createBrowserHistory";

    const history = createHistory({
        // NOTE: all params are optional
        basename: "/", // The base URL of the app
        forceRefresh: false, // Set true to force full page refreshes
        keyLength: 6, // The length of location.key
        // A function to use to confirm navigation with the user 
        getUserConfirmation: (message, callback) => callback(window.confirm(message))
    });

    class MyComponent extends React.Component {
        constructor(props) {
            super(props)
            this.state = {}
        }
        render() {
            return (
                <button onClick={() => history.push("/route")}>
                { /* or */ }
                <button onClick={() => this.props.history.push("/route")}>
            )
        }
    }
    ```

    [usage (docs)](https://github.com/ReactTraining/history/blob/master/README.md)
