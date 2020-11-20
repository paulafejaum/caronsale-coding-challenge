import {ILogin} from "../interface/ILogin";
import {injectable, inject} from "inversify";
import axios from "../../../axios";
import crypto from "crypto";
import {IAuthenticationResult} from "../../../models/IAuthenticationResult";
import "reflect-metadata";


@injectable()
export class Login implements ILogin {

    public static readonly ERROR_MESSAGE: string = "Error authenticating";
    private authData: IAuthenticationResult = {token: "", userId: ""};

    public getAuthData(): IAuthenticationResult {
        return this.authData;
    }

    public async authenticate(): Promise<void> {
        const {npm_package_config_password: rawPassword = "", npm_package_config_user: user = ""} = process.env
        const password = this.hashPasswordWithCycles(rawPassword, 5);
        const url = `/v1/authentication/${user}`;
        await axios.put(url, {password, meta: ``})
            .then(response => {
                if (response.data.authenticated)
                    this.authData = response.data;
                else
                    throw new Error("User not authenticated.")
            })
            .catch(err => {throw new Error(`${Login.ERROR_MESSAGE} - ${err.response ? err.response.data.message : err}`)});

    }

    private hashPasswordWithCycles(plainTextPassword: string, cycles: number): string {
        let hash = `${plainTextPassword}`;

        for (let i = 0; i < cycles; i++) {
            hash = crypto.createHash('sha512').update(hash).digest('hex');
        }
        return hash;
    }

}