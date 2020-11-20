/**
 * This interface describe the model of the data of the report of running auctions.
 */
export interface IAuctionReport {

    /**
     * Number of running actions.
     */
    totalAuctions: number,

    /**
     * The average percentage of the auction progress(ratio of current highest bid value and minimum required ask.
     */
    averageProgress: number,

    /**
     * The average number of bids on an auction.
     */
    averageBids: number,
}
