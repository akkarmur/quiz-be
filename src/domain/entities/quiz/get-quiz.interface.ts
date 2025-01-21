/**
 *
 * @export
 * @interface Quiz200
 */
export interface Quiz200 {
  /**
   *
   * @type {string}
   * @memberof Quiz200
   */
  message: string
  /**
   *
   * @type {Quiz200Data}
   * @memberof Quiz200
   */
  data: Quiz200Data
}

export interface Quiz200Data {
  /**
   *
   * @type {number}
   * @memberof Quiz200Data
   */
  totalCount: number
  /**
   *
   * @type {Array<Quiz200DataDataInner>}
   * @memberof Quiz200Data
   */
  data: Array<Quiz200DataDataInner>
}

export interface Quiz200DataDataInner {
  /**
   *
   * @type {number}
   * @memberof Quiz200DataDataInner
   */
  vocab_id: number
  /**
   *
   * @type {string}
   * @memberof Quiz200DataDataInner
   */
  question: string
  /**
   *
   * @type {Array<string>}
   * @memberof Quiz200DataDataInner
   */
  options: Array<string>
  /**
   *
   * @type {string}
   * @memberof Quiz200DataDataInner
   */
  answer: string
}

export function Quiz200DataDataInnerFromJSON(json: any): Quiz200DataDataInner {
  return Quiz200DataDataInnerFromJSONTyped(json, false)
}

export function Quiz200DataDataInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): Quiz200DataDataInner {
  if (json == null) {
    return json
  }
  return {
    vocab_id: json['vocab_id'],
    question: json['question'],
    options: json['options'],
    answer: json['answer'],
  }
}
