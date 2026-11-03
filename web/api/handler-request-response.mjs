import { InternalError } from '../../commons/errors.mjs';
import mapToHttpError from '../map-to-http-errors.mjs';

// A higher-order function that wraps a request handler to handle errors and send appropriate HTTP responses
export default function wrapperHandler(handler){
  return function (req, res){
    // Call the handler function in a centralized way to avoid code repetition in all handlers.
    const ret = handler(req, res);

    // Log the returned value for debugging purposes
    //console.log("wrapperHandler: ret =", ret);

    // If the returned value is an error response, send the appropriate HTTP status and message
    if (ret && ret.constructor === InternalError){
      const httpError = mapToHttpError(ret);
      res.status(httpError.status);
      res.json(httpError.error);
      return;
    }

    // Otherwise, the handler was successful, so send the result as a JSON response
    const result = ret;
    res.json(result);
  };
}