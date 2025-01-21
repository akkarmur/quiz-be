/**
 *
 * @export
 * @interface Level200
 */
export interface Level200 {
  /**
   *
   * @type {string}
   * @memberof Level200
   */
  message: string
  /**
   *
   * @type {Level200Data}
   * @memberof Level200
   */
  data: Level200Data
}

/**
 *
 * @export
 * @interface Level200Data
 */
export interface Level200Data {
  /**
   *
   * @type {number}
   * @memberof Level200Data
   */
  totalCount: number
  /**
   *
   * @type {Array<Level200DataDataInner>}
   * @memberof Level200Data
   */
  data: Array<Level200DataDataInner>
}

/**
 *
 * @export
 * @interface Level200DataDataInner
 */
export interface Level200DataDataInner {
  /**
   *
   * @type {number}
   * @memberof Level200DataDataInner
   */
  level: number
}

export function Level200DataDataInnerFromJSON(
  json: any,
): Level200DataDataInner {
  return Level200DataDataInnerFromJSONTyped(json)
}

export function Level200DataDataInnerFromJSONTyped(
  json: any,
): Level200DataDataInner {
  if (json == null) {
    return json
  }
  return {
    level: json['level'] == null ? undefined : json['level'],
  }
}
