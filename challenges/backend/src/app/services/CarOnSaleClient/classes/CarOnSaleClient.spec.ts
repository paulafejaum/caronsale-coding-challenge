
import "reflect-metadata";
import {container} from "../../../inversify.config";
import {expect} from "chai";
import moxios from 'moxios'
import axios from "../../../axios";
import {describe, beforeEach, afterEach, it, before} from "mocha";
import {DependencyIdentifier} from '../../../DependencyIdentifiers';
import {ICarOnSaleClient} from "../interface/ICarOnSaleClient";
import {IAuctionReport} from "../../../models/IAuctionReport";
import {CarOnSaleClient} from "./CarOnSaleClient";

describe('CarOnSale Auctions API Test', () => {
    let carOnSaleClient: ICarOnSaleClient;

    before(() => {
        carOnSaleClient = container.get<ICarOnSaleClient>(DependencyIdentifier.CARONSALE);
    });

    beforeEach(() => {
        moxios.install(axios);
    });

    afterEach(() => {
        moxios.uninstall(axios);
    });

    it('On empty auctions', async () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({status: 200, response: {items: []}});
        });

        const result = await carOnSaleClient.getRunningAuctions();
        expect(result).to.eql([]);
    });

    it('On running auctions', async () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200,
                response: {
                    items: [
                        {currentHighestBidValue: 10, numBids: 5, minimumRequiredAsk: 1000},
                        {currentHighestBidValue: 20, numBids: 5, minimumRequiredAsk: 1000},
                        {currentHighestBidValue: 30, numBids: 5, minimumRequiredAsk: 1000}
                    ]
                }
            });
        });

        const result = await carOnSaleClient.getRunningAuctions();
        expect(result).to.be.an('array');
        result.map(item => expect(item).to.have.all.keys('currentHighestBidValue', 'numBids', 'minimumRequiredAsk'));
    });

    it('On not authenticated user', async () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 401,
                response: {message: "Internal Error"}
            });
        });

        try {
            await carOnSaleClient.getRunningAuctions();
        } catch (err) {
            expect(err).to.contain(CarOnSaleClient.ERROR_MESSAGE);
        }

    });

    it('On internal error', async () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent()
            request.respondWith({
                status: 500,
                response: {message: "Internal Error"}
            });
        });

        try {
            await carOnSaleClient.getRunningAuctions();
        } catch (err) {
            expect(err).to.contain(CarOnSaleClient.ERROR_MESSAGE);
        }

    });

});

describe('Report Data Test', () => {

    let carOnSaleClient: ICarOnSaleClient;

    before(() => {
        carOnSaleClient = container.get<ICarOnSaleClient>(DependencyIdentifier.CARONSALE);
    });

    it('On empty auctions report', async () => {
        const auctions = [];

        const result: IAuctionReport = await carOnSaleClient.getAuctionReportData(auctions);
        expect(result).to.deep.include({totalAuctions: 0});
        expect(result).to.deep.include({averageProgress: 0});
        expect(result).to.deep.include({averageBids: 0});
    });

    it('On no bids at one item', async () => {
        const auctions = [
            {currentHighestBidValue: 1000, numBids: 3, minimumRequiredAsk: 1000},
            {currentHighestBidValue: 2000, numBids: 0, minimumRequiredAsk: 1000},
            {currentHighestBidValue: 3000, numBids: 3, minimumRequiredAsk: 1000},
        ];

        const result: IAuctionReport = await carOnSaleClient.getAuctionReportData(auctions);
        expect(result).to.deep.include({totalAuctions: 3});
        expect(result).to.deep.include({averageProgress: 2});
        expect(result).to.deep.include({averageBids: 2});
    });

    it('On no minimumRequiredAsk at one item', async () => {
        const auctions = [
            {currentHighestBidValue: 1000, numBids: 1, minimumRequiredAsk: 1000},
            {currentHighestBidValue: 2000, numBids: 2, minimumRequiredAsk: 1000},
            {currentHighestBidValue: 1000, numBids: 3, minimumRequiredAsk: 0},
        ];

        const result: IAuctionReport = await carOnSaleClient.getAuctionReportData(auctions);
        expect(result).to.deep.include({totalAuctions: 3});
        expect(result).to.deep.include({averageProgress: 1});
        expect(result).to.deep.include({averageBids: 2});
    });

    it('On no minimumRequiredAsk and no currentHighestBidValue at one item', async () => {
        const auctions = [
            {currentHighestBidValue: 1000, numBids: 1, minimumRequiredAsk: 1000},
            {currentHighestBidValue: 2000, numBids: 2, minimumRequiredAsk: 1000},
            {currentHighestBidValue: 0, numBids: 3, minimumRequiredAsk: 0},
        ];

        const result: IAuctionReport = await carOnSaleClient.getAuctionReportData(auctions);
        expect(result).to.deep.include({totalAuctions: 3});
        expect(result).to.deep.include({averageProgress: 1});
        expect(result).to.deep.include({averageBids: 2});
    });

    it('All data set', async () => {
        const auctions = [
            {currentHighestBidValue: 1000, numBids: 1, minimumRequiredAsk: 1000},
            {currentHighestBidValue: 2000, numBids: 2, minimumRequiredAsk: 1000},
            {currentHighestBidValue: 3000, numBids: 3, minimumRequiredAsk: 1000},
        ];

        const result: IAuctionReport = await carOnSaleClient.getAuctionReportData(auctions);
        expect(result).to.deep.include({totalAuctions: 3});
        expect(result).to.deep.include({averageProgress: 2});
        expect(result).to.deep.include({averageBids: 2});
    });
});