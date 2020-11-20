import {IAuction} from "../../../models/IAuction";
import {IAuctionReport} from "../../../models/IAuctionReport";
/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface ICarOnSaleClient {

    /**
     * Retrieve all running auctions using the CarOnSale API.
     */
    getRunningAuctions(): Promise<IAuction[]>;

    /**
     * @param auctionList - List of auctions that will be used to provide the report information.
     *
     * Retrieve the compiled data of the list of running auctions.
     */
    getAuctionReportData(auctionList: IAuction[]): IAuctionReport;
}