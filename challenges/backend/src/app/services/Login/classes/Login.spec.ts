
import "reflect-metadata";
import {container} from "../../../inversify.config";
import {expect} from "chai";
import moxios from 'moxios'
import axios from "../../../axios";
import {describe, beforeEach, afterEach, it, before} from "mocha";
import {DependencyIdentifier} from '../../../DependencyIdentifiers';
import {ILogin} from "../interface/ILogin";
import {Login} from "./Login";
import {IAuthenticationResult} from "../../../models/IAuthenticationResult";

describe('Authentication API Test', () => {
    let login: ILogin;

    before(() => {
        login = container.get<ILogin>(DependencyIdentifier.LOGIN);
    });

    beforeEach(() => {
        moxios.install(axios);
    });

    afterEach(() => {
        moxios.uninstall(axios);
    });

    it('On empty user', async () => {

        process.env.npm_package_config_user = "";
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({status: 404, response: {message: "Not found"}});
        });


        try {
            await login.authenticate();
        } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain(Login.ERROR_MESSAGE);
            const authData: IAuthenticationResult = login.getAuthData();
            expect(authData).to.deep.include({userId: ""});
            expect(authData).to.deep.include({token: ""});
        }
    });

    it('On wrong user', async () => {
        process.env.npm_package_config_password = "test@test.com";
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({status: 401, response: {message: "Unauthorized"}});
        });

        try {
            await login.authenticate();
        } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain(Login.ERROR_MESSAGE);
            const authData: IAuthenticationResult = login.getAuthData();
            expect(authData).to.deep.include({userId: ""});
            expect(authData).to.deep.include({token: ""});
        }
    });

    it('On empty password', async () => {
        process.env.npm_package_config_password = "";
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({status: 401, response: {message: "Unauthorized"}});
        });

        try {
            await login.authenticate();
        } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain(Login.ERROR_MESSAGE);
            const authData: IAuthenticationResult = login.getAuthData();
            expect(authData).to.deep.include({userId: ""});
            expect(authData).to.deep.include({token: ""});
        }
    });

    it('On wrong password', async () => {
        process.env.npm_package_config_password = "test";
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({status: 401, response: {message: "Unauthorized"}});
        });

        try {
            await login.authenticate();
        } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain(Login.ERROR_MESSAGE);
            const authData: IAuthenticationResult = login.getAuthData();
            expect(authData).to.deep.include({userId: ""});
            expect(authData).to.deep.include({token: ""});
        }
    });

    it('On user and password ok but not authenticated', async () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: {
                    authenticated: false,
                    userId: "user@user.com",
                    token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IlRPS0VOLXNhbGVzbWFuQHJhbmRvbS5jb20iLCJ1c2VyVXVpZCI6ImNlNWUzZDdmLTNhM2QtNGZkZS05NmJjLTk4NmQ1ZjQ4M2RmOCIsImlhdCI6MTYwNTg5Njc0NCwiZXhwIjoxNjA2MTU1OTQ0fQ.cdOFEU9kj8lmFQ6LvP7424MXMrTbm7R_gZ5Z_c7MQ-1WXdLSBp2wlutHN_KtFcZSMcQ-vQ374Y7_MqsePcLdmmcVSZipRD53YbWWVyw94huUsQG4c4i4ES-oRTmn3TgpBSKY5xlDIfAaf5J581ZIlxeMbt3Iv6Gzx-x3G7SpxJw"
                }
            });
        });

        try {
            await login.authenticate();
        } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.contain(Login.ERROR_MESSAGE);
            const authData: IAuthenticationResult = login.getAuthData();
            expect(authData).to.deep.include({userId: ""});
            expect(authData).to.deep.include({token: ""});
        }



    });

    it('On user and password ok', async () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: {
                    authenticated: true,
                    userId: "user@user.com",
                    token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IlRPS0VOLXNhbGVzbWFuQHJhbmRvbS5jb20iLCJ1c2VyVXVpZCI6ImNlNWUzZDdmLTNhM2QtNGZkZS05NmJjLTk4NmQ1ZjQ4M2RmOCIsImlhdCI6MTYwNTg5Njc0NCwiZXhwIjoxNjA2MTU1OTQ0fQ.cdOFEU9kj8lmFQ6LvP7424MXMrTbm7R_gZ5Z_c7MQ-1WXdLSBp2wlutHN_KtFcZSMcQ-vQ374Y7_MqsePcLdmmcVSZipRD53YbWWVyw94huUsQG4c4i4ES-oRTmn3TgpBSKY5xlDIfAaf5J581ZIlxeMbt3Iv6Gzx-x3G7SpxJw"
                }
            });
        });

        await login.authenticate();
        const authData: IAuthenticationResult = login.getAuthData();
        expect(authData).to.include.keys('userId', 'token');
        expect(authData).to.deep.include({userId: "user@user.com"});
    });
});