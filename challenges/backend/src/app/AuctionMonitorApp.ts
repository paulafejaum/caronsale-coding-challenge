import {inject, injectable} from "inversify";
import {ILogger} from "./services/Logger/interface/ILogger";
import {DependencyIdentifier} from "./DependencyIdentifiers";
import "reflect-metadata";
import {ICarOnSaleClient} from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import {ILogin} from "./services/Login/interface/ILogin";
import {IAuction} from "./models/IAuction";
import {IAuctionReport} from "./models/IAuctionReport";

@injectable()
export class AuctionMonitorApp {

    public constructor(@inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.CARONSALE) private carOnSale: ICarOnSaleClient,
        @inject(DependencyIdentifier.LOGIN) private login: ILogin) {
    }

    private printAuctionMonitor(reportData: IAuctionReport) {
        this.logger.log(`Total Running Auctions: ${reportData.totalAuctions}`);
        this.logger.log(`Average Bids          : ${reportData.averageBids.toFixed(2)}`);
        this.logger.log(`Average Progress      : ${reportData.averageProgress.toFixed(2)}\n`);
    }

    public async start(): Promise<void> {
        this.logger.log(`Auction Monitor started.`);
        this.logger.log(`Authenticating...\n`);
        try {
            await this.login.authenticate();
            const runningAuctions: IAuction[] = await this.carOnSale.getRunningAuctions();
            const reportData: IAuctionReport = this.carOnSale.getAuctionReportData(runningAuctions);
            this.printAuctionMonitor(reportData);
            this.logger.log(`Auction Monitor ended.`);
            process.exit(0);
        } catch (err) {
            this.logger.error(err);
            process.exit(-1);
        }

    }
}