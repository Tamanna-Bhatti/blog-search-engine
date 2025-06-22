class APIError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const handleSQLiteError = (err) => {
    // Common SQLite error codes
    const sqliteErrors = {
        SQLITE_CONSTRAINT: 'Database constraint violation',
        SQLITE_BUSY: 'Database is busy, please try again',
        SQLITE_READONLY: 'Database is read-only',
        SQLITE_CORRUPT: 'Database file is corrupted',
        SQLITE_NOTFOUND: 'Requested resource not found'
    };

    const errorCode = Object.keys(sqliteErrors).find(code => err.code?.includes(code));
    if (errorCode) {
        return new APIError(500, sqliteErrors[errorCode]);
    }
    return new APIError(500, 'Database error occurred');
};

const handleJSONError = (err) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return new APIError(400, 'Invalid JSON format in request');
    }
    return err;
};

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Handle SQLite errors
    if (err.code?.startsWith('SQLITE_')) {
        err = handleSQLiteError(err);
    }

    // Handle JSON parsing errors
    err = handleJSONError(err);

    // Set default status code and status
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const errorResponse = {
        status: err.status,
        message: err.message
    };

    // Add additional details in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error = err;
        errorResponse.stack = err.stack;
    }

    // Send error response
    res.status(err.statusCode).json(errorResponse);
};

module.exports = {
    APIError,
    errorHandler
};
