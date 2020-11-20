import {ILogger} from "../interface/ILogger";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class Logger implements ILogger {

    private LOG: string = "LOG";
    private ERROR: string = "ERROR";

    private print(type: string, message: string): void {
        // tslint:disable-next-line: no-console
        console.log(`[${type}]: ${message}`);
    }

    public log(message: string): void {
        this.print(this.LOG, message);
    }

    public error(message: string): void {
        this.print(this.ERROR, message);
    }

}