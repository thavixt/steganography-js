// @ts-nocheck
// eslint-disable
// `react-scripts build` silently fails otherwise
// (webpack encounters eslint(or typescipt?) errors in webworker scope and fails to output anything)

// usage: https://github.com/facebook/create-react-app/issues/3660#issuecomment-602547574
// use the public folder so webpack won't process the worker file

export default function worker() {
  /**
     * ...
     * Worker function body here
     * ...
     */
}
