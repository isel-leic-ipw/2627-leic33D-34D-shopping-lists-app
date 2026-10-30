export const ERROR_CODES = {
    INVALID_PARAMETER_CODE: 1,
    LISTS_NOT_FOUND_CODE: 2,
    LIST_NOT_FOUND_CODE: 3,
    ITEM_NOT_FOUND_CODE: 4,
    INVALID_API_TOKEN_CODE: 5,
    AUTHENTICATION_REQUIRED_CODE: 6,
    USER_ALREADY_EXISTS_CODE: 7
};

export function InternalError(code, message, description) {
    this.code = code;
    this.message = message;
    this.description = description;
}

export default {
    INVALID_PARAMETER: (name, description) => new InternalError(
        ERROR_CODES.INVALID_PARAMETER_CODE, 
        `Invalid parameter: ${name}`, 
        description || `The parameter "${name}" is invalid or missing.`
    ),
    LISTS_NOT_FOUND: () => new InternalError(
        ERROR_CODES.LISTS_NOT_FOUND_CODE,
        'No shopping lists found',
        'There are no shopping lists available in the system. Contact the administrator'
    ),
    LIST_NOT_FOUND: (listId) => new InternalError(
        ERROR_CODES.LIST_NOT_FOUND_CODE,
        `List with id ${listId} not found`,
        'The requested list does not exist in the system.'
    ),
    ITEM_NOT_FOUND: (itemId) => new InternalError(
        ERROR_CODES.ITEM_NOT_FOUND_CODE,
        `Item with id ${itemId} not found`,
        'The requested item does not exist in the system.'
    ),
    INVALID_API_TOKEN: () => new InternalError(
        ERROR_CODES.INVALID_API_TOKEN_CODE,
        'Invalid API token',
        'The provided API token is invalid. Please provide a valid token to access the API.'
    ),
    AUTHENTICATION_REQUIRED: (description) => new InternalError(
        ERROR_CODES.AUTHENTICATION_REQUIRED_CODE,
        'Authentication required',
        description || 'You must be authenticated to access this resource.'
    ),
    USER_ALREADY_EXISTS: (username) => new InternalError(
        ERROR_CODES.USER_ALREADY_EXISTS_CODE,
        `User ${username} already exists`,
        'A user with the specified username already exists in the system.'
    )
};