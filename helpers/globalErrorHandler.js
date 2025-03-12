export const globalErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(err.status ?? 500).json({
      msg:
        !err.status || err.status === 500
          ? "Internal server error"
          : err.message,
    });
  }

  return res.status(err.status ?? 500).json({
    msg: err.message,
    data: err.data,
    stack: err.stack,
  });
};
