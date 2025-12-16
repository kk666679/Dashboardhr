// Basic validation utility functions

/**
 * Validates if a value is not empty
 * @param {any} value - The value to validate
 * @returns {boolean} - True if the value is not empty, false otherwise
 */
function isNotEmpty(value) {
  return value !== null && value !== undefined && value !== '';
}

/**
 * Validates if a string is a valid email
 * @param {string} email - The email string to validate
 * @returns {boolean} - True if the email is valid, false otherwise
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a number is within a specified range
 * @param {number} num - The number to validate
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {boolean} - True if the number is within the range, false otherwise
 */
function isInRange(num, min, max) {
  return num >= min && num <= max;
}

module.exports = {
  isNotEmpty,
  isValidEmail,
  isInRange
};
