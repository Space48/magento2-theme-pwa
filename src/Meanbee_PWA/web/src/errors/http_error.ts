/**
 * This error indicates that there was something wrong with the HTTP request itself to the server. It does not indicate
 * a problem with the body of the request, just the transport.
 */
class HttpError extends Error {
    constructor(m: string) {
        super(m);

        // @see https://github.com/Microsoft/TypeScript-wiki/blob/a7ebdad90f61813275e8bb678ded2f45ae9ed6c4/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

export = HttpError;