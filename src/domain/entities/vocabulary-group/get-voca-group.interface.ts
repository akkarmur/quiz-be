import VocabularyGroup from '../../../infrastructure/orm/sequelize/entities/t_vocabulary_group'

/**
 *
 * @export
 * @interface VocabularyGroup200
 */
export interface VocabularyGroup200 {
  /**
   *
   * @type {string}
   * @memberof VocabularyGroup200
   */
  message: string
  /**
   *
   * @type {VocabularyGroup200Data}
   * @memberof VocabularyGroup200
   */
  data: VocabularyGroup200Data
}

export interface VocabularyGroup200Data {
  /**
   *
   * @type {number}
   * @memberof VocabularyGroup200Data
   */
  totalCount: number
  /**
   *
   * @type {Array<VocabularyGroup200DataDataInner>}
   * @memberof VocabularyGroup200Data
   */
  data: Array<VocabularyGroup200DataDataInner>
}

/**
 *
 * @export
 * @interface VocabularyGroup200DataDataInner
 */
export interface VocabularyGroup200DataDataInner {
  /**
   *
   * @type {number}
   * @memberof VocabularyGroup200DataDataInner
   */
  id: number
  /**
   *
   * @type {string}
   * @memberof VocabularyGroup200DataDataInner
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof VocabularyGroup200DataDataInner
   */
  description?: string

  /**
   *
   * @type {boolean}
   * @memberof VocabularyGroup200DataDataInner
   */
  is_public?: boolean
  /**
   *
   * @type {boolean}
   * @memberof VocabularyGroup200DataDataInner
   */
  is_active?: boolean
  /**
   *
   * @type {number}
   * @memberof VocabularyGroup200DataDataInner
   */
  created_by: number
  /**
   *
   * @type {Date}
   * @type {Date}
   * @memberof VocabularyGroup200DataDataInner
   */
  created_at: Date
  /**
   *
   * @type {Date}
   * @memberof VocabularyGroup200DataDataInner
   */
  updated_at: Date
}

export type VocabularyGroupDB = Pick<
  VocabularyGroup,
  | 'id'
  | 'name'
  | 'description'
  | 'is_public'
  | 'is_active'
  | 'created_by'
  | 'created_at'
  | 'created_at'
  | 'updated_at'
>

export function VocabularyGroup200DataDataInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): VocabularyGroup200DataDataInner {
  if (json == null) {
    return json
  }
  return {
    id: json['id'],
    name: json['name'],
    description: json['description'],
    is_public: json['is_public'] == null ? undefined : json['is_public'],
    is_active: ignoreDiscriminator
      ? json['is_active'] == null
        ? undefined
        : json['is_active']
      : undefined,
    created_by: json['created_by'],
    created_at: new Date(json['created_at']),
    updated_at: new Date(json['updated_at']),
  }
}
