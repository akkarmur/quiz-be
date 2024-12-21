/**
 * Generates a random string of a given length. The string will contain
 * characters from the set of uppercase letters, lowercase letters, and
 * numbers.
 *
 * @param {number} length The length of the string to generate.
 *
 * @returns {string} A random string of the given length.
 */
export const randomNameGenerator = (length: number) => {
  /**
   * The string of characters that we will randomly select from to
   * generate the random name.
   */
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  /**
   * The variable we will use to store the generated random name.
   */
  let randomName = ''

  /**
   * Loop through and generate the random name, character by character.
   */
  for (let i = 0; i < length; i++) {
    /**
     * Generate a random index into the string of characters.
     */
    const randomIndex = Math.floor(Math.random() * characters.length)

    /**
     * Select the character at the random index from the string of
     * characters, and append it to the random name.
     */
    randomName += characters.charAt(randomIndex)
  }

  /**
   * Return the generated random name.
   */
  return randomName
}
