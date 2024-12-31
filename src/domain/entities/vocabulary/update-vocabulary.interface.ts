/**
 *
 * @export
 * @interface VocabularyPatchReqInner
 */
export interface VocabularyPatchReqInner {
  /**
   *
   * @type {number}
   * @memberof VocabularyPatchReqInner
   */
  id: number

  /**
   *
   * @type {string}
   * @memberof VocabularyPatchReqInner
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
   * @type {Express.Multer.File}
   * @memberof VocabularyPostReqInner
   */
  image?: Express.Multer.File | string
  /**
   *
   * @type {number}
   * @memberof VocabularyPostReqInner
   */
  updated_by?: number
}
