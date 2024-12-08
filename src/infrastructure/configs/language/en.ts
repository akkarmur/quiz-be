const joiErrors = {
  ALTERNATIVES_ALL:
    '{{field}}: All of the provided alternatives must be valid.',
  ALTERNATIVES_ANY:
    '{{field}}: At least one of the provided alternatives must be valid.',
  ALTERNATIVES_MATCH: '{{field}}: None of the provided alternatives is valid.',
  ALTERNATIVES_ONE:
    '{{field}}: Only one of the provided alternatives must be valid.',
  ALTERNATIVES_TYPES:
    '{{field}}: This field must be one of the allowed types: {{types}}.',
  ANY_CUSTOM: '{{field}}: This field failed custom validation.',
  ANY_DEFAULT: "{{field}}: Default value couldn't be applied.",
  ANY_FAILOVER: "{{field}}: Failover value couldn't be applied.",
  ANY_INVALID: '{{field}}: Invalid input.',
  ANY_ONLY: '{{field}}: This field must be {{number}}.',
  ANY_REF: '{{field}}: This field references an unknown sibling: {{ref}}.',
  ANY_REQUIRED: '{{field}}: This field is required.',
  ANY_UNKNOWN: '{{field}}: This field is not allowed.',
  ARRAY_BASE: '{{field}}: This field must be an array.',
  ARRAY_EXCLUDES:
    '{{field}}: This field contains an excluded value: {{value}}.',
  ARRAY_INCLUDES_REQUIRED_BOTH:
    '{{field}}: This field must contain both of {{peers}}.',
  ARRAY_INCLUDES_REQUIRED_KNOWNS:
    '{{field}}: This field must contain {{peers}}.',
  ARRAY_INCLUDES_REQUIRED_UNKNOWNS:
    '{{field}}: This field must contain at least one of {{peers}}.',
  ARRAY_INCLUDES: '{{field}}: This field must contain {{values}}.',
  ARRAY_LENGTH: '{{field}}: This field must have {{number}} item(s).',
  ARRAY_MAX: '{{field}}: This field must have at most {{number}} item(s).',
  ARRAY_MIN: '{{field}}: This field must have at least {{number}} item(s).',
  ARRAY_ORDERED_LENGTH:
    '{{field}}: This field must have {{number}} item(s) at position {{pos}}.',
  ARRAY_SORT: '{{field}}: This field must be sorted.',
  ARRAY_SORT_MISMATCHING:
    '{{field}}: This field must be sorted with the provided comparators.',
  ARRAY_SORT_UNSUPPORTED: '{{field}}: Unsupported sort format: {{order}}.',
  ARRAY_SPARSE: '{{field}}: This field cannot have undefined items.',
  ARRAY_UNIQUE: '{{field}}: This field must have unique elements.',
  ARRAY_HAS_KNOWN:
    '{{field}}: This field must contain at least one of {{peers}}.',
  ARRAY_HAS_UNKNOWN:
    '{{field}}: This field must contain at least one of the unknown peers: {{peers}}.',
  BINARY_BASE: '{{field}}: This field must be a buffer or a string.',
  BINARY_LENGTH: '{{field}}: This field must have {{number}} bytes.',
  BINARY_MAX: '{{field}}: This field must be at most {{number}} bytes.',
  BINARY_MIN: '{{field}}: This field must be at least {{number}} bytes.',
  BOOLEAN_BASE: '{{field}}: This field must be a boolean (true or false).',
  DATE_BASE: '{{field}}: Invalid date format.',
  DATE_FORMAT: '{{field}}: Invalid date format. It must be in {{format}}.',
  DATE_GREATER: '{{field}}: This field must be greater than {{number}}.',
  DATE_LESS: '{{field}}: This field must be less than {{number}}.',
  DATE_MAX: '{{field}}: This field must be on or before {{number}}.',
  DATE_MIN: '{{field}}: This field must be on or after {{number}}.',
  DATE_STRICT: '{{field}}: Invalid date.',
  FUNCTION_ARITY: '{{field}}: This field must have {{n}} arguments.',
  FUNCTION_CLASS: '{{field}}: This field must be a class constructor.',
  FUNCTION_MAXARITY: '{{field}}: This field must have at most {{n}} arguments.',
  FUNCTION_MINARITY:
    '{{field}}: This field must have at least {{n}} arguments.',
  NUMBER_BASE: '{{field}}: This field must be a number.',
  NUMBER_GREATER: '{{field}}: This field must be greater than {{number}}.',
  NUMBER_INFINITY: '{{field}}: This field must be an infinity.',
  NUMBER_INTEGER: '{{field}}: This field must be an integer.',
  NUMBER_LESS: '{{field}}: This field must be less than {{number}}.',
  NUMBER_MAX: '{{field}}: This field must be less than or equal to {{number}}.',
  NUMBER_MIN:
    '{{field}}: This field must be greater than or equal to {{number}}.',
  NUMBER_MULTIPLE: '{{field}}: This field must be a multiple of {{base}}.',
  NUMBER_NEGATIVE: '{{field}}: This field must be a negative number.',
  NUMBER_PORT: '{{field}}: This field must be a valid port number.',
  NUMBER_POSITIVE: '{{field}}: This field must be a positive number.',
  NUMBER_PRECISION:
    '{{field}}: This field must have no more than {{number}} decimal places.',
  NUMBER_UNSAFE: '{{field}}: This field must be a safe number.',
  OBJECT_UNKNOWN:
    '{{field}}: This field contains an unknown property: {{child}}.',
  OBJECT_AND: '{{field}}: These fields are missing: {{present}}.',
  OBJECT_ASSERT: '{{field}}: This field failed to pass the assertion test.',
  OBJECT_BASE: '{{field}}: This field must be an object.',
  OBJECT_LENGTH: '{{field}}: This field must have {{number}} children.',
  OBJECT_MAX: '{{field}}: This field must have at most {{number}} children.',
  OBJECT_MIN: '{{field}}: This field must have at least {{number}} children.',
  OBJECT_MISSING: '{{field}}: This field is required.',
  OBJECT_NAND:
    '{{field}}: {{main}} must not exist simultaneously with {{peers}}.',
  OBJECT_PATTERN_MATCH:
    '{{field}}: This field failed to match the required pattern.',
  OBJECT_REFTYPE: '{{field}}: Invalid reference type.',
  OBJECT_REGEX: '{{field}}: This field must be a RegExp object.',
  OBJECT_RENAME_MULTIPLE:
    '{{field}}: This field cannot rename child {{from}} because multiple renames are disabled and another key was already renamed to {{to}}.',
  OBJECT_RENAME_OVERRIDE:
    '{{field}}: Cannot rename child {{from}} because override is disabled and target {{to}} exists.',
  OBJECT_SCHEMA: '{{field}}: Invalid schema.',
  OBJECT_INSTANCE: '{{field}}: Invalid instance.',
  OBJECT_WITH: '{{field}}: This field is required when {{peer}} is present.',
  OBJECT_WITHOUT:
    '{{field}}: This field is not allowed when {{peer}} is present.',
  OBJECT_XOR: 'Only one of {{peers}} is allowed.',
  OBJECT_OXOR: '{{field}}: Exactly one of {{peers}} is required.',
  STRING_ALPHANUM:
    '{{field}}: This field must only contain alpha-numeric characters.',
  STRING_BASE64: '{{field}}: This field must be a valid Base64 string.',
  STRING_BASE: '{{field}}: This field must be a string.',
  STRING_CREDITCARD:
    '{{field}}: This field must be a valid credit card number.',
  STRING_DATAURI: '{{field}}: This field must be a valid data URI.',
  STRING_DOMAIN: '{{field}}: This field must be a valid domain name.',
  STRING_EMAIL: '{{field}}: Please enter a valid email address.',
  STRING_EMPTY: '{{field}}: This field cannot be empty.',
  STRING_GUID: '{{field}}: This field must be a valid GUID.',
  STRING_HEXALIGN: '{{field}}: This field hex encoding must be byte aligned.',
  STRING_HEX: '{{field}}: This field must be a valid hexadecimal string.',
  STRING_HOSTNAME: '{{field}}: This field must be a valid hostname.',
  STRING_IPVERSION:
    '{{field}}: This field must be a valid IP address of version {{version}}.',
  STRING_IP: '{{field}}: This field must be a valid IP address.',
  STRING_ISODATE: '{{field}}: This field must be a valid ISO 8601 date format.',
  STRING_ISODURATION:
    '{{field}}: This field must be a valid ISO 8601 duration format.',
  STRING_LENGTH: '{{field}}: This field must be {{number}} character(s) long.',
  STRING_LOWERCASE: '{{field}}: This field must be in lowercase.',
  STRING_MAX:
    '{{field}}: This field must have at most {{number}} character(s).',
  STRING_MIN:
    '{{field}}: This field must have at least {{number}} character(s).',
  STRING_NORMALIZE:
    '{{field}}: This field must be Unicode normalized in the {{form}} form.',
  STRING_PATTERN_BASE:
    '{{field}}: This field failed to match the required pattern.',
  STRING_PATTERN_NAME:
    '{{field}}: This field failed to match the {{name}} pattern.',
  STRING_PATTERN_INVERT_BASE:
    '{{field}}: This field cannot match the {{pattern}} pattern.',
  STRING_PATTERN_INVERT_NAME:
    '{{field}}: This field cannot match the {{name}} pattern.',
  STRING_TOKEN:
    '{{field}}: This field must only contain alpha-numeric characters, underscores, and hyphens.',
  STRING_TRIM:
    '{{field}}: This field must not have leading or trailing whitespace.',
  STRING_UPPERCASE: '{{field}}: This field must be in uppercase.',
  STRING_URI: '{{field}}: Please enter a valid URI.',
  STRING_URICUSTOMSCHEME:
    '{{field}}: This field must be a valid URI with a scheme matching the {{scheme}} pattern.',
  STRING_URIRELATIVEONLY: '{{field}}: This field must be a valid relative URI.',
  SYMBOL_BASE: '{{field}}: This field must be a symbol.',
  SYMBOL_MAP: '{{field}}: This field must be a valid symbol mapping.',
}
const serverErrors = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  OK: 'OK',
  UNAUTHORIZED: 'Unauthorized User',
  NOT_FOUND: 'Data not found',
  INVALID_TOKEN: 'Invalid Token',
  FORBIDDEN: 'You do not have permission to access this resource.',
  LOGIN_REQUIRED: 'Login Required',
  CREATED: 'Created Successfully',
  OTP_SENT_SUCCESSFULLY: 'OTP Sent Successfully',
  REGISTERED_SUCCESSFULLY: 'Registered Successfully',
  LOGOUT_SUCCESSFUL: 'Log Out Successful',
  LOGIN_SUCCESSFUL: 'Log In Successful',
  PASSWORD_RESET_SUCCESSFULLY: 'Password Reset Successfully',
  GET_USER_DETAILS_SUCCESS: 'Details Retrieved Successfully',
  NO_DATA_FOUND: 'Data not found',
  DATA_DELETED_SUCCESSFULLY: 'Data deleted successfully',
  DATA_UPDATED_SUCCESSFULLY: 'Data update successfully',
  ALREADY_EXIST: 'Data already exist',
  DUPLICATED_DATA: 'Data duplicated',
  OTP_INVALID: 'Otp not valid.',
  OTP_EXPIRED: 'Otp has expired',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid Token',
  TOKEN_PREDATED: 'Wrong token',
  INVALID_CREDENTIALS: 'Invalid Credentials',
  NOT_REGISTERED: 'User not registered',
  PARENT_NOT_EXISTS: 'Parent does not exists',
  NAME_ALREADY_EXISTS: 'Name already exists',
  DATA_RESTORED_SUCCESSFULLY: 'Data Restored Successfully',
  AT_LEAST_ONE_IMAGE_REQUIRED: 'At least one image required',
  FAVORITE_ADDED_SUCCESSFULLY: 'Product added to Favorites',
  FAVORITE_REMOVED_SUCCESSFULLY: 'Product removed from Favorites',
  REVIEW_ADDED_SUCCESSFULLY: 'Thanks for your Review.',
}

export default { ...joiErrors, ...serverErrors }
