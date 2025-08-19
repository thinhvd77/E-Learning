const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);

    // Default error
    let status = 500;
    let message = 'Internal server error';

    // Handle specific error types
    if (error.name === 'ValidationError') {
        status = 400;
        message = error.message;
    } else if (error.name === 'CastError') {
        status = 400;
        message = 'Invalid ID format';
    } else if (error.code === '23505') { // PostgreSQL unique violation
        status = 409;
        message = 'Duplicate entry';
    } else if (error.code === '23503') { // PostgreSQL foreign key violation
        status = 400;
        message = 'Invalid reference';
    } else if (error.message) {
        message = error.message;
    }

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

module.exports = errorHandler;