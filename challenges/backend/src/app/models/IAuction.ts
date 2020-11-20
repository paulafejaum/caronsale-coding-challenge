/**
 * This interface describe the model of an auction object returned from CarOnSale API.
 * Only the relevant fields are declared.
 */
export interface IAuction {

    /**
     * Value that is indicating the current highest bid value on the auction.
     */
    currentHighestBidValue: number,

    /**
     * Number of bids placed on an auction.
     */
    numBids: number,

    /**
     * The minimal price the seller user wants to reach for this specific auction. If an auction ends above
     * that price, the auction is successful right away (switching to state CLOSED_WAITING_FOR_PAYMENT).
     * If the auction ends below the minimum required ask, the auction will switch to state CLOSED_BELOW_MIN_ASK,
     * which then requires the seller's explicit "confirmation" or "rejection" of the highest bid value.
     */
    minimumRequiredAsk: number,
}
