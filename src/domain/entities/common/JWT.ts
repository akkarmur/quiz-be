/**
 * TokenDetails is an interface that represents the details of a JSON Web Token
 * that are stored in the token itself.
 *
 * @prop {number} id - The id of the user.
 * @prop {string} role - The role of the user. Can be either 'user', 'admin', or 'super_admin'.
 * @prop {string} email - The email of the user.
 */
export interface TokenDetails {
  id: number
  role: string
  email: string
}
