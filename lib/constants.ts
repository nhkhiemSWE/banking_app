// Prefer module-level constants/objects over classes with only static members
// Define primitive values first so they can be referenced inside objects.
const EMAIL_MAX_LEN_VALUE = 50
const NAME_MAX_LEN_VALUE = 50
const ADDRESS_MAX_LEN_VALUE = 50
const CITY_MAX_LEN_VALUE = 50
const STATE_MAX_LEN_VALUE = 50
const POSTAL_CODE_MAX_LEN_VALUE = 6
const PASSWORD_MIN_LEN_VALUE = 8
const DOB_LENGTH_VALUE = 10 // mm-dd-yyyy
const SSN_LENGTH_VALUE = 11 // xxx-xx-xxxx
const DOB_MAX_AGE_YEARS_VALUE = 150

const baseAuthFormValidator = {
  // Values
  EMAIL_MAX_LEN_VALUE,
  NAME_MAX_LEN_VALUE,
  ADDRESS_MAX_LEN_VALUE,
  CITY_MAX_LEN_VALUE,
  STATE_MAX_LEN_VALUE,
  POSTAL_CODE_MAX_LEN_VALUE,
  PASSWORD_MIN_LEN_VALUE,
  DOB_LENGTH_VALUE, // mm-dd-yyyy
  SSN_LENGTH_VALUE, // xxx-xx-xxxx
  DOB_MAX_AGE_YEARS_VALUE,

  // Patterns (Values)
  DOB_REGEX_VALUE: /^\d{2}-\d{2}-\d{4}$/,
  SSN_REGEX_VALUE: /^\d{3}-\d{2}-\d{4}$/,

  // Messages
  EMAIL_INVALID_MESSAGE: 'Invalid email address',
  EMAIL_REQUIRED_MESSAGE: 'Email is required',
  EMAIL_MAX_MESSAGE: `Email must be at most ${EMAIL_MAX_LEN_VALUE} characters`,

  FIRST_NAME_REQUIRED_MESSAGE: 'First name is required',
  FIRST_NAME_MAX_MESSAGE: `First name must be at most ${NAME_MAX_LEN_VALUE} characters`,

  LAST_NAME_REQUIRED_MESSAGE: 'Last name is required',
  LAST_NAME_MAX_MESSAGE: `Last name must be at most ${NAME_MAX_LEN_VALUE} characters`,

  ADDRESS_REQUIRED_MESSAGE: 'Address is required',
  ADDRESS_MAX_MESSAGE: `Address must be at most ${ADDRESS_MAX_LEN_VALUE} characters`,

  CITY_REQUIRED_MESSAGE: 'City is required',
  CITY_MAX_MESSAGE: `City must be at most ${CITY_MAX_LEN_VALUE} characters`,

  STATE_REQUIRED_MESSAGE: 'State is required',
  STATE_MAX_MESSAGE: `State must be at most ${STATE_MAX_LEN_VALUE} characters`,

  PASSWORD_REQUIRED_MESSAGE: 'Password is required',
  PASSWORD_MIN_MESSAGE: `Password must be at least ${PASSWORD_MIN_LEN_VALUE} characters`,

  POSTAL_CODE_REQUIRED_MESSAGE: 'Postal code is required',
  POSTAL_CODE_MAX_MESSAGE: `Postal code must be at most ${POSTAL_CODE_MAX_LEN_VALUE} characters`,

  DOB_FORMAT_MESSAGE: 'DOB must be in the format mm-dd-yyyy',
  DOB_TOO_OLD_MESSAGE: `DOB cannot be more than ${DOB_MAX_AGE_YEARS_VALUE} years ago`,
  DOB_FUTURE_MESSAGE: 'DOB cannot be in the future',
  DOB_INVALID_MESSAGE: 'DOB must be a valid date',

  SSN_FORMAT_MESSAGE: 'SSN must be 9 digits (xxx-xx-xxxx)',
  SSN_LENGTH_MESSAGE: 'SSN must be 9 digits (xxx-xx-xxxx)',
} as const

export const AuthFormValidator = Object.freeze({
  ...baseAuthFormValidator,
})


