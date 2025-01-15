import { env } from '../../../infrastructure/env'
import UserVocabularyScore from '../../../infrastructure/orm/sequelize/entities/t_user_vocabulary_score'
import Vocabulary from '../../../infrastructure/orm/sequelize/entities/t_vocabulary'

/**
 *
 * @export
 * @interface Vocabulary200
 */
export interface Vocabulary200 {
  /**
   *
   * @type {string}
   * @memberof Vocabulary200
   */
  message: string
  /**
   *
   * @type {Vocabulary200Data}
   * @memberof Vocabulary200
   */
  data: Vocabulary200Data
}

/**
 *
 * @export
 * @interface Vocabulary200Data
 */
export interface Vocabulary200Data {
  /**
   *
   * @type {number}
   * @memberof Vocabulary200Data
   */
  totalCount: number
  /**
   *
   * @type {Array<Vocabulary200DataDataInner>}
   * @memberof Vocabulary200Data
   */
  data: Array<Vocabulary200DataDataInner>
}

/**
 *
 * @export
 * @interface Vocabulary200DataDataInner
 */
export interface Vocabulary200DataDataInner {
  /**
   *
   * @type {number}
   * @memberof Vocabulary200DataDataInner
   */
  id: number
  /**
   *
   * @type {number}
   * @memberof Vocabulary200DataDataInner
   */
  vocab_group_id: number
  /**
   *
   * @type {string}
   * @memberof Vocabulary200DataDataInner
   */
  word: string
  /**
   *
   * @type {string}
   * @memberof Vocabulary200DataDataInner
   */
  language: string
  /**
   *
   * @type {string}
   * @memberof Vocabulary200DataDataInner
   */
  note_word?: string
  /**
   *
   * @type {string}
   * @memberof Vocabulary200DataDataInner
   */
  image?: string
  /**
   *
   * @type {string}
   * @memberof Vocabulary200DataDataInner
   */
  meaning: string
  /**
   *
   * @type {string}
   * @memberof Vocabulary200DataDataInner
   */
  pronunciation: string
  /**
   *
   * @type {string}
   * @memberof Vocabulary200DataDataInner
   */
  note_meaning?: string
  /**
   *
   * @type {number}
   * @memberof Vocabulary200DataDataInner
   */
  level?: number
  /**
   *
   * @type {string}
   * @memberof Vocabulary200DataDataInner
   */
  type?: string
  /**
   *
   * @type {boolean}
   * @memberof Vocabulary200DataDataInner
   */
  is_active?: boolean
  /**
   *
   * @type {Date}
   * @memberof Vocabulary200DataDataInner
   */
  created_at: Date
  /**
   *
   * @type {Date}
   * @memberof Vocabulary200DataDataInner
   */
  updated_at: Date

  user_vocabulary_score?: {
    /**
     * @type {number}
     * Attempt count of the user for the vocabulary
     */
    attempt_count: number

    /**
     * @type {number}
     * Score of the user for the vocabulary in percentage
     */
    score: number

    /**
     * @type {number}
     * User id who created the vocabulary
     */
    user_id: number
  }
}

interface IUserVocabularyScore {
  vocab_id: number
  attempt_count: number
  score?: number // Calculated field
  created_by: number
}

export interface IVocabulary extends Vocabulary {
  id: number
  vocab_group_id: number
  word: string
  language: string
  note_word?: string
  image?: string
  meaning: string
  pronunciation: string
  note_meaning?: string
  level?: number
  type?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
  user_scores?: IUserVocabularyScore[] // Association
}

export type VocabularyQuiz =
  | Pick<Vocabulary, 'id'>
  | Pick<UserVocabularyScore, 'attempt_count' | 'correct_count' | 'created_by'>

/**
 * Check if a given object implements the Vocabulary200DataDataInner interface.
 */
export function instanceOfVocabulary200DataDataInner(
  value: object,
): value is Vocabulary200DataDataInner {
  if (!('id' in value) || value['id'] === undefined) return false
  if (!('vocab_group_id' in value) || value['vocab_group_id'] === undefined)
    return false
  if (!('word' in value) || value['word'] === undefined) return false
  if (!('language' in value) || value['language'] === undefined) return false
  if (!('meaning' in value) || value['meaning'] === undefined) return false
  if (!('pronunciation' in value) || value['pronunciation'] === undefined)
    return false
  if (!('created_at' in value) || value['created_at'] === undefined)
    return false
  if (!('updated_at' in value) || value['updated_at'] === undefined)
    return false
  return true
}

export function Vocabulary200DataDataInnerFromJSON(
  json: any,
  ignoreDiscriminator: boolean = false,
  isUser: boolean = false,
): Vocabulary200DataDataInner {
  return Vocabulary200DataDataInnerFromJSONTyped(
    json,
    ignoreDiscriminator,
    isUser,
  )
}

export function Vocabulary200DataDataInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean = false,
  isUser: boolean = false,
): Vocabulary200DataDataInner {
  if (json == null) {
    return json
  }
  const user_vocabulary_score = isUser
    ? {
        attempt_count:
          json?.user_scores[0]?.dataValues?.attempt_count == null
            ? undefined
            : json?.user_scores[0]?.dataValues?.attempt_count,
        score:
          json?.user_scores[0]?.dataValues?.score == null
            ? undefined
            : json?.user_scores[0]?.dataValues?.score,
        user_id:
          json?.user_scores[0]?.dataValues?.created_by == null
            ? undefined
            : json?.user_scores[0]?.dataValues?.created_by,
      }
    : undefined
  return {
    id: json['id'],
    vocab_group_id: json['vocab_group_id'],
    word: json['word'],
    language: json['language'],
    note_word: json['note_word'] == null ? undefined : json['note_word'],
    image: json['image'] == null ? undefined : env.IMG_BASE_URL + json['image'],
    meaning: json['meaning'],
    pronunciation: json['pronunciation'],
    note_meaning:
      json['note_meaning'] == null ? undefined : json['note_meaning'],
    level: json['level'] == null ? undefined : json['level'],
    type: json['type'] == null ? undefined : json['type'],
    is_active: ignoreDiscriminator
      ? json['is_active'] == null
        ? undefined
        : json['is_active']
      : undefined,
    created_at: new Date(json['created_at']),
    updated_at: new Date(json['updated_at']),
    user_vocabulary_score: user_vocabulary_score,
  }
}
