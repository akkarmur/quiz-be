import { createHash } from 'crypto'

/**
 * Converts the given data to an MD5 hash.
 *
 * @param {string} data The data to hash.
 * @returns {string} The MD5 hash of the given data.
 */
export const convertToMd5 = (data: string): string => {
  const hash = createHash('md5')
  hash.update(data)
  return hash.digest('hex')
}
