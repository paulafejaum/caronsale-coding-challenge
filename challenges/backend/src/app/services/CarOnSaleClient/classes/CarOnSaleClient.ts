import {ICarOnSaleClient} from "../interface/ICarOnSaleClient";
import {inject, injectable} from "inversify";
import axios from "../../../axios";
import "reflect-metadata";
import {IAuction} from "../../../models/IAuction";
import {IAuctionReport} from "../../../models/IAuctionReport";
import {DependencyIdentifier} from "../../../DependencyIdentifiers";
import {ILogin} from "../../Login/interface/ILogin";

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {

    public static readonly ERROR_MESSAGE: string = "Error on auctions retrive";

    public constructor(@inject(DependencyIdentifier.LOGIN) private login: ILogin) {
    }

    public getAuctionReportData(auctionList: IAuction[]): IAuctionReport {
        if (!auctionList || auctionList.length === 0) {
            return {totalAuctions: 0, averageProgress: 0, averageBids: 0};
        }

        const totalAuctions: number = auctionList.length;
        const totalData = auctionList.reduce((acc, auction) => {
            acc.totalBids += auction.numBids;
            acc.totalProgress += auction.minimumRequiredAsk > 0 ? auction.currentHighestBidValue / auction.minimumRequiredAsk : 0;
            return acc;
        }, {totalBids: 0, totalProgress: 0});

        return {
            totalAuctions,
            averageProgress: totalData.totalProgress / totalAuctions,
            averageBids: totalData.totalBids / totalAuctions
        };
    }

    public async getRunningAuctions(): Promise<IAuction[]> {
        const {userId, token} = this.login.getAuthData();
        return new Promise<IAuction[]>((resolve, reject) => {
            const listRunningAuction = `/v2/auction/buyer/`;
            axios.get(listRunningAuction, {headers: {userid: userId, authtoken: token}})
                .then(response => resolve(response.data.items))
                .catch(err => reject(`${CarOnSaleClient.ERROR_MESSAGE} - ${err.response.data.message}`));
        });
    }
}
