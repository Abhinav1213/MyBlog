export const validate = (schemas) => (req, res, next) => {
  const locations = ["body", "headers", "params", "query"];
  const errors = [];

  for (const key of locations) {
    if (schemas[key]) {
      try {
        req[key] = schemas[key].parse(req[key]);
      } catch (err) {
        const fieldErrors = err.errors.map((e) => ({
          location: key,
          field: e.path.join("."),
          message: e.message,
        }));
        errors.push(...fieldErrors);
      }
    }
  }

  if (errors.length > 0) {
    console.warn("⚠️ Validation failed:", {
      route: req.originalUrl,
      method: req.method,
      errors,
    });

    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  next();
};
