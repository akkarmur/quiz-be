/**
 *
 * @export
 * @interface VocabularyPostReqInner
 */
export interface VocabularyPostReqInner {
  /**
   *
   * @type {number}
   * @memberof VocabularyPostReqInner
   */
  vocab_group_id: number
  /**
   *
   * @type {string}
   * @memberof VocabularyPostReqInner
   */
  word: string
  /**
   *
   * @type {string}
   * @memberof VocabularyPostReqInner
   */
  language: string
  /**
   *
   * @type {string}
   * @memberof VocabularyPostReqInner
   */
  note_word?: string
  /**
   *
   * @type {string}
   * @memberof VocabularyPostReqInner
   */
  image?: string
  /**
   *
   * @type {string}
   * @memberof VocabularyPostReqInner
   */
  meaning: string
  /**
   *
   * @type {string}
   * @memberof VocabularyPostReqInner
   */
  pronunciation: string
  /**
   *
   * @type {string}
   * @memberof VocabularyPostReqInner
   */
  note_meaning?: string
  /**
   *
   * @type {number}
   * @memberof VocabularyPostReqInner
   */
  level?: number
  /**
   *
   * @type {string}
   * @memberof VocabularyPostReqInner
   */
  type?: string
}

/**
 * Check if a given object implements the VocabularyPostReqInner interface.
 */
export function instanceOfVocabularyPostReqInner(
  value: object,
): value is VocabularyPostReqInner {
  if (!('vocab_group_id' in value) || value['vocab_group_id'] === undefined)
    return false
  if (!('word' in value) || value['word'] === undefined) return false
  if (!('language' in value) || value['language'] === undefined) return false
  if (!('meaning' in value) || value['meaning'] === undefined) return false
  if (!('pronunciation' in value) || value['pronunciation'] === undefined)
    return false
  return true
}

export function VocabularyPostReqInnerFromJSON(
  json: any,
): VocabularyPostReqInner {
  return VocabularyPostReqInnerFromJSONTyped(json, false)
}

export function VocabularyPostReqInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): VocabularyPostReqInner {
  if (json == null) {
    return json
  }
  return {
    vocab_group_id: json['vocab_group_id'],
    word: json['word'],
    language: json['language'],
    note_word: json['note_word'] == null ? undefined : json['note_word'],
    image: json['image'] == null ? undefined : json['image'],
    meaning: json['meaning'],
    pronunciation: json['pronunciation'],
    note_meaning:
      json['note_meaning'] == null ? undefined : json['note_meaning'],
    level: json['level'] == null ? undefined : json['level'],
    type: json['type'] == null ? undefined : json['type'],
  }
}

export function VocabularyPostReqInnerToJSON(
  json: any,
): VocabularyPostReqInner {
  return VocabularyPostReqInnerToJSONTyped(json, false)
}

export function VocabularyPostReqInnerToJSONTyped(
  value?: VocabularyPostReqInner | null,
  ignoreDiscriminator: boolean = false,
): any {
  if (value == null) {
    return value
  }

  return {
    vocab_group_id: value['vocab_group_id'],
    word: value['word'],
    language: value['language'],
    note_word: value['note_word'],
    image: value['image'],
    meaning: value['meaning'],
    pronunciation: value['pronunciation'],
    note_meaning: value['note_meaning'],
    level: value['level'],
    type: value['type'],
  }
}
