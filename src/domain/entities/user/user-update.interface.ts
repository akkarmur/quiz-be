/**
 *
 * @export
 * @interface UserPatchReq
 */
export interface UserPatchReq {
  /**
   *
   * @type {number}
   * @memberof UserPatchReq
   */
  id: number
  /**
   *
   * @type {string}
   * @memberof UserPatchReq
   */
  name: string
  /**
   *
   * @type {string}
   * @memberof UserPatchReq
   */
  profile_image?: string
  /**
   *
   * @type {Express.Multer.File}
   * @memberof UserPatchReq
   */
  image?: Express.Multer.File
  /**
   *
   * @type {string}
   * @memberof UserPatchReq
   */
  updated_by?: string
}
