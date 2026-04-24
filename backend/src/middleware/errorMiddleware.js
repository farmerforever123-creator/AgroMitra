export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the stack trace internally
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
