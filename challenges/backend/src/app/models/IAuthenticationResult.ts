/**
 * This interface describe the model of an authentication object returned from CarOnSale API.
 * Only the relevant fields are declared.
 */
export interface IAuthenticationResult {

    /**
     * Authenticated user.
     */
    userId: string,

    /**
     * The token that should be used for further requests.
     */
    token: string,

}