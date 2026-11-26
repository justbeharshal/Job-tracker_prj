const Joi = require('joi');

const VALID_STATUSES = ['WISHLIST', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];

const VALID_SORTS = [
  'updated_at_desc',
  'applied_on_desc',
  'applied_on_asc',
  'company_asc',
];

/**
 * Validates an ISO date string and normalizes it to YYYY-MM-DD for MySQL DATE columns.
 * (Joi.string().isoDate() coerces dates to full ISO timestamps, which MySQL DATE rejects.)
 */
function isoDateOnly(label) {
  return Joi.string()
    .isoDate()
    .allow('', null)
    .optional()
    .custom((value) => (value ? value.slice(0, 10) : value))
    .messages({
      'string.isoDate': `${label} must be a valid ISO date (YYYY-MM-DD)`,
    });
}

// ── Create / Update application ───────────────────────────────────────────────
const applicationBodySchema = Joi.object({
  company:    Joi.string().trim().min(1).max(150).required().messages({
    'any.required': 'Company name is required',
  }),
  role:       Joi.string().trim().min(1).max(150).required().messages({
    'any.required': 'Role is required',
  }),
  location:   Joi.string().trim().max(150).allow('', null).optional(),
  jobUrl:     Joi.string().trim().uri().max(500).allow('', null).optional().messages({
    'string.uri': 'Job URL must be a valid URL',
  }),
  salary:     Joi.string().trim().max(50).allow('', null).optional(),
  status:     Joi.string().valid(...VALID_STATUSES).default('WISHLIST'),
  appliedOn:  isoDateOnly('Applied date'),
  followUpOn: isoDateOnly('Follow-up date'),
});

// ── Status-only patch ─────────────────────────────────────────────────────────
const statusPatchSchema = Joi.object({
  status: Joi.string().valid(...VALID_STATUSES).required().messages({
    'any.only': `Status must be one of: ${VALID_STATUSES.join(', ')}`,
    'any.required': 'Status is required',
  }),
});

// ── Note body ─────────────────────────────────────────────────────────────────
const noteBodySchema = Joi.object({
  content: Joi.string().trim().min(1).max(5000).required().messages({
    'any.required': 'Note content is required',
    'string.min':   'Note content cannot be empty',
  }),
});

// ── List query params ─────────────────────────────────────────────────────────
const listQuerySchema = Joi.object({
  status: Joi.string().valid(...VALID_STATUSES).optional(),
  q:      Joi.string().trim().max(200).optional(),
  page:   Joi.number().integer().min(1).default(1),
  limit:  Joi.number().integer().min(1).max(100).default(10),
  sort:   Joi.string().valid(...VALID_SORTS).default('updated_at_desc'),
});

module.exports = {
  applicationBodySchema,
  statusPatchSchema,
  noteBodySchema,
  listQuerySchema,
};
