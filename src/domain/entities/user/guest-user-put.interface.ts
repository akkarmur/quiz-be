/**
 *
 * @export
 * @interface GuestUserRegistrationPostReq
 */
export interface GuestUserRegistrationPostReq {
  /**
   *
   * @type {string}
   * @memberof GuestUserRegistrationPostReq
   */
  device_id: string
  /**
   *
   * @type {string}
   * @memberof GuestUserRegistrationPostReq
   */
  device_token?: string
  /**
   *
   * @type {string}
   * @memberof GuestUserRegistrationPostReq
   */
  os: string
}

/**
 * Checks if a given object implements the GuestUserRegistrationPostReq interface.
 *
 * @param {object} value The value to check.
 * @returns {boolean} true if the value implements the GuestUserRegistrationPostReq interface.
 */
export function instanceOfGuestUserRegistrationPostReq(value: object): boolean {
  let isInstance = true

  // First, check if the value has the required property 'deviceId'.
  isInstance = isInstance && 'deviceId' in value

  // Next, check if the value has the required property 'deviceToken'.
  isInstance = isInstance && 'deviceToken' in value

  // Lastly, check if the value has the required property 'os'.
  isInstance = isInstance && 'os' in value

  // If all the checks pass, the value implements the GuestUserRegistrationPostReq interface.
  return isInstance
}

/**
 * Converts a JSON object to a GuestUserRegistrationPostReq object.
 *
 * This function takes a JSON object as input and converts it into
 * a GuestUserRegistrationPostReq object. If the input is undefined
 * or null, the function returns the input without doing anything.
 *
 * @param {any} json The JSON object to convert.
 * @returns {GuestUserRegistrationPostReq} The converted GuestUserRegistrationPostReq object.
 */
export function GuestUserRegistrationPostReqFromJSON(
  json: any,
): GuestUserRegistrationPostReq {
  // If the input is undefined or null, return it without doing anything.
  if (json === undefined || json === null) {
    return json
  }

  // Otherwise, call the typed version of the function, which does the actual conversion.
  return GuestUserRegistrationPostReqFromJSONTyped(json)
}

/**
 * Converts a JSON object to a GuestUserRegistrationPostReq object.
 *
 * This function takes a JSON object as input and converts it into
 * a GuestUserRegistrationPostReq object. If the input is undefined
 * or null, the function returns the input without doing anything.
 *
 * The function first checks if the input is undefined or null. If
 * it is, the function returns the input without doing anything. This
 * is because the function is designed to be idempotent, meaning that
 * if the input is already a GuestUserRegistrationPostReq object, the
 * function should return the input without modifying it.
 *
 * If the input is not undefined or null, the function calls the
 * GuestUserRegistrationPostReqFromJSONTyped function. This function
 * takes the input JSON object and converts it into a GuestUserRegistrationPostReq
 * object. The function does this by creating a new object and adding
 * the required properties to it. The properties are:
 *
 * - device_id: a string representing the device ID.
 * - device_token: an optional string representing the device token.
 * - latitude: an optional number representing the latitude.
 * - longitude: an optional number representing the longitude.
 * - os: a string representing the operating system.
 *
 * The function then returns the converted GuestUserRegistrationPostReq
 * object.
 *
 * @param {any} json The JSON object to convert.
 * @returns {GuestUserRegistrationPostReq} The converted GuestUserRegistrationPostReq
 * object.
 */
export function GuestUserRegistrationPostReqFromJSONTyped(
  json: any,
): GuestUserRegistrationPostReq {
  if (json === undefined || json === null) {
    return json
  }

  // Create a new object and add the required properties to it.
  return {
    device_id: json['device_id'],
    device_token: json['device_token'],
    os: json['os'],
  }
}

/**
 * Converts a GuestUserRegistrationPostReq object to a JSON object.
 *
 * This function takes an optional GuestUserRegistrationPostReq object
 * as input and returns a JSON object. If the input is undefined, the
 * function returns undefined. If the input is null, the function returns
 * null.
 *
 * If the input is a GuestUserRegistrationPostReq object, the function
 * creates a new object and adds the required properties to it. The
 * properties are:
 *
 * - device_id: a string representing the device ID.
 * - device_token: an optional string representing the device token.
 * - os: a string representing the operating system.
 *
 * The function then returns the converted JSON object.
 *
 * @param {GuestUserRegistrationPostReq | null | undefined} value The
 * GuestUserRegistrationPostReq object to convert. If undefined, the
 * function returns undefined. If null, the function returns null.
 * @returns {any} The converted JSON object.
 */
export function GuestUserRegistrationPostReqToJSON(
  value?: GuestUserRegistrationPostReq | null,
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }

  // Create a new object and add the required properties to it.
  return {
    device_id: value.device_id,
    device_token: value.device_token,
    os: value.os,
  }
}
