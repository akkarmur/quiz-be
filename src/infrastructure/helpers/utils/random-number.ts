/**
 * Generates a random number with a specified number of digits.
 * The number of digits is specified by the `digit` parameter.
 *
 * @param {number} digit - The number of digits the generated number should have
 * @returns {string} - A string representation of the generated random number
 */
export const randomNumber = (digit: number): string => {
  const maxValue = Math.pow(10, digit) // Calculate the maximum value of the number with the specified number of digits

  // Generate a random number between 0 and maxValue
  const randomOtp = Math.floor(Math.random() * maxValue)

  // Convert the generated number to a string and pad it with leading zeros if necessary
  // The `padStart` method takes two arguments: the length of the string and the character to use for padding
  // In this case, we're padding the string with leading zeros to ensure it has the correct number of digits
  return randomOtp.toString().padStart(digit, '0')
}
