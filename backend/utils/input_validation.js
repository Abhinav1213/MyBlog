import { z } from "zod";

const transformQuery = (query) => {
  const result = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === "true") result[key] = true;
    else if (value === "false") result[key] = false;
    else if (!isNaN(value) && value.trim() !== "") result[key] = Number(value);
    else if (Array.isArray(value))
      result[key] = value.map((v) => transformQuery({ [key]: v })[key]);
    else result[key] = value;
  }
  return result;
};

const transformHeaders = (headers) => {
  const result = {};
  for (const [key, value] of Object.entries(headers)) {
    result[key.toLowerCase()] = value;
  }
  return result;
};

export const validate = (schemas) => (req, res, next) => {
  const errors = [];
  const validatedData = {};

  // Validate each part if schema exists
  if (schemas.headers) {
    try {
      const headers = transformHeaders(req.headers);
      validatedData.headers = schemas.headers.parse(headers);
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((e) => {
          errors.push({
            location: "headers",
            field: e.path.join("."),
            message: e.message,
            received: e.received,
          });
        });
      }
    }
  }

  if (schemas.body) {
    try {
      validatedData.body = schemas.body.parse(req.body);
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((e) => {
          errors.push({
            location: "body",
            field: e.path.join("."),
            message: e.message,
            received: e.received,
          });
        });
      }
    }
  }

  if (schemas.params) {
    try {
      validatedData.params = schemas.params.parse(req.params);
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((e) => {
          errors.push({
            location: "params",
            field: e.path.join("."),
            message: e.message,
            received: e.received,
          });
        });
      }
    }
  }

  if (schemas.query) {
    try {
      const query = transformQuery(req.query);
      validatedData.query = schemas.query.parse(query);
    } catch (err) {
      if (err instanceof z.ZodError) {
        err.errors.forEach((e) => {
          errors.push({
            location: "query",
            field: e.path.join("."),
            message: e.message,
            received: e.received,
          });
        });
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

  // Attach all validated data to req.validated
  req.validated = validatedData;
  next();
};
