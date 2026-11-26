const { sendError } = require('../utils/response');

/**
 * Returns Express middleware that validates req.body (default) or req.query
 * against the given Joi schema.
 *
 * @param {import('joi').Schema} schema  - Joi schema to validate against
 * @param {'body'|'query'} [source='body'] - Which part of the request to validate
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,  // collect all errors, not just the first
      stripUnknown: true, // remove fields not in the schema
    });

    if (error) {
      const message = error.details.map((d) => d.message).join('; ');
      return sendError(res, message, 400);
    }

    // Replace the source with the validated (and coerced) value
    req[source] = value;
    return next();
  };
}

module.exports = validate;
