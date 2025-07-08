export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    const fieldErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    console.warn("⚠️ Validation failed:", {
      route: req.originalUrl,
      method: req.method,
      body: req.body,
      errors: fieldErrors,
    });

    return res.status(400).json({
      message: "Validation error",
      errors: fieldErrors,
    });
  }
};
