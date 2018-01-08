/**
 * This exception indicates that there was a problem with the content of the response that was returned by the server.
 * This could be due to it not being a JSON object or the JSON object being malformed.
 */
class ResponseFormatError extends Error {
    constructor(m: string) {
        super(m);

        // @see https://github.com/Microsoft/TypeScript-wiki/blob/a7ebdad90f61813275e8bb678ded2f45ae9ed6c4/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, ResponseFormatError.prototype);
    }
}

export = ResponseFormatError;