// Basic formatting utility functions

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} - The formatted currency string
 */
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Formats a date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} - The formatted date string
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalizeWords(str) {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

module.exports = {
  formatCurrency,
  formatDate,
  capitalizeWords
};
