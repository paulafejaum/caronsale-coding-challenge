import {IAuthenticationResult} from "../../../models/IAuthenticationResult";

/**
 * This service describes an interface to perform login using the CarOnSale API.
 */
export interface ILogin {

    /**
     * Authenticate user using the CarOnSale API.
     */
    authenticate(): Promise<void>;

    /**
     * Retrieve userId and token provided by the authenticate() method.
     * If no user is logged, userId and token will be empty.
     */
    getAuthData(): IAuthenticationResult;

}