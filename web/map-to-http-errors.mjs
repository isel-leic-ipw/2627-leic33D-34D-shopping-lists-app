import { ERROR_CODES } from '../commons/errors.mjs';

const HTTP_STATUS_CODES = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

function HttpErrorResponse(status, message, description) {
    this.status = status;
    this.error = { message, description };
}

function mapOtherErrors(error) {
    
    // Error with explicit HTTP status code (e.g., JSON parsing errors)
    const status = error?.status || error?.statusCode;
    if (status && status >= 400 && status < 600) {
        return new HttpErrorResponse(
            status,
            error.name || 'Request error',
            error.message || 'An error occurred while processing the request.'
        );
    }

    // Default fallback for unexpected errors (500)
    return new HttpErrorResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, 'Internal server error');
}

export default function mapToHttpError(error) {
    switch (error?.code) {
        case ERROR_CODES.INVALID_PARAMETER_CODE:
        case ERROR_CODES.USER_ALREADY_EXISTS_CODE:
            return new HttpErrorResponse(HTTP_STATUS_CODES.BAD_REQUEST, error.message, error.description);
        case ERROR_CODES.LISTS_NOT_FOUND_CODE:
            return new HttpErrorResponse(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, error.message, error.description);
        case ERROR_CODES.INVALID_API_TOKEN_CODE:
        case ERROR_CODES.AUTHENTICATION_REQUIRED_CODE:
            return new HttpErrorResponse(HTTP_STATUS_CODES.UNAUTHORIZED, error.message, error.description);
        case ERROR_CODES.LIST_NOT_FOUND_CODE:
        case ERROR_CODES.ITEM_NOT_FOUND_CODE:
        case ERROR_CODES.ROUTE_NOT_FOUND_CODE:
            return new HttpErrorResponse(HTTP_STATUS_CODES.NOT_FOUND, error.message, error.description);
        default:
            return mapOtherErrors(error);
    }
}