import mapToHttpError from '../map-to-http-errors.mjs';

export function sendHttpError(res, error){
    const httpError = mapToHttpError(error);
    res.status(httpError.status);
    res.json(httpError.error);
}

// A higher-order function that wraps a request handler to handle errors and send appropriate HTTP responses.
// The handler returns a Promise: resolved with the result or rejected with an InternalError.
export default function wrapperHandler(handler){
  return function (req, res){
    // Call the handler function in a centralized way to avoid code repetition in all handlers.
    handler(req, res)
      .then(result => {
        // The handler was successful, so send the result as a JSON response
        res.json(result);
      })
      .catch(error => {
        // Send the appropriate HTTP status and message
        sendHttpError(res, error);
      });
  };
}