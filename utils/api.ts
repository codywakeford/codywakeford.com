/**Returns an error with response data. */
export function apiError(type: Omit<ApiFailure, "ok" | "statusMessage">): ApiFailure {
    const statusMessages: { [key: number]: string } = {
        100: "Continue",
        101: "Switching Protocols",
        102: "Processing",
        300: "Multiple Choices",
        301: "Moved Permanently",
        302: "Found",
        303: "See Other",
        304: "Not Modified",
        305: "Use Proxy",
        307: "Temporary Redirect",
        308: "Permanent Redirect",
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Payload Too Large",
        414: "URI Too Long",
        415: "Unsupported Media Type",
        416: "Range Not Satisfiable",
        417: "Expectation Failed",
        418: "I'm a teapot",
        421: "Misdirected Request",
        422: "Unprocessable Entity",
        423: "Locked",
        424: "Failed Dependency",
        425: "Too Early",
        426: "Upgrade Required",
        427: "Precondition Required",
        428: "Too Many Requests",
        429: "Request Header Fields Too Large",
        431: "Unavailable For Legal Reasons",
        451: "Unavailable For Legal Reasons",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported",
        506: "Variant Also Negotiates",
        507: "Insufficient Storage",
        508: "Loop Detected",
        510: "Not Extended",
        511: "Network Authentication Required",
    }

    const statusMessage = statusMessages[type.statusCode] || "Error"

    const error: ApiFailure = {
        ok: false,
        statusCode: type.statusCode,
        statusMessage,
        message: type.message,
    }

    console.error(error)

    return error
}

/**Returns a response with response data */
export function apiSuccess<T>(data: T, statusCode: number = 200): ApiSuccess<T> {
    const statusMessages: { [key: number]: string } = {
        200: "OK",
        201: "Created",
        202: "Accepted",
        203: "Non-Authoritative Information",
        204: "No Content",
        205: "Reset Content",
        206: "Partial Content",
        401: "Email or Password Incorrect",
    }

    const statusMessage = statusMessages[statusCode] || "Success"

    return {
        ok: true,
        statusCode,
        statusMessage,
        data: data,
    }
}
