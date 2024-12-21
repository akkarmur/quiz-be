export interface VocabularyPostReq {
  vocab_group_id: number
  data: Array<VocabularyPostReqInner>
}

/**
 *
 * @export
 * @interface VocabularyPostReqInner
 */
export interface VocabularyPostReqInner {
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
  /**
   *
   * @type {number}
   * @memberof VocabularyPostReqInner
   */
  created_by: number
}

export interface VocabularyPostReqInnerData extends VocabularyPostReqInner {
  vocab_group_id: number
}
