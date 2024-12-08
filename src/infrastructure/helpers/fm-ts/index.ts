import * as O from 'fp-ts/Option'

/**
 * Takes an array or null and returns an Option<D[]> that contains either
 * the array if it's not null or empty, or None if it is.
 *
 * @param data the array to be checked
 * @returns an Option<D[]> that contains the array if it's not null or empty
 *          or None if it is.
 */
export const optionFormatForArray = <D>(data?: D[] | null): O.Option<D[]> => {
  // Check if the data is null or undefined
  if (!data) {
    // If it is, return None
    return O.none
  }

  // Check if the data is an array
  if (!Array.isArray(data)) {
    // If it's not, return None
    return O.none
  }

  // Check if the array is empty
  if (!data.length) {
    // If it is, return None
    return O.none
  }

  // If the array is not null or empty, return it wrapped in Some
  return O.some(data)
}

/**
 * Takes an object or null and returns an Option<D> that contains either
 * the object if it's not null or empty, or None if it is.
 *
 * @param data the object to be checked
 * @returns an Option<D> that contains the object if it's not null or empty
 *          or None if it is.
 */
export const optionFormatForObject = <D>(data?: D | null): O.Option<D> => {
  // Check if the data is null or undefined
  if (!data) {
    // If it is, return None
    return O.none
  }

  // Check if the data is an object
  if (typeof data !== 'object') {
    // If it's not, return None
    return O.none
  }

  // Check if the object is empty
  if (Object.keys(data).length === 0) {
    // If it is, return None
    return O.none
  }

  // If the object is not null or empty, return it wrapped in Some
  return O.some(data)
}
