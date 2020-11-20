import {container} from "./inversify.config";
import {ILogger} from "./services/Logger/interface/ILogger";
import {AuctionMonitorApp} from "./AuctionMonitorApp";
import {DependencyIdentifier} from "./DependencyIdentifiers";

/*
 * Inject all dependencies in the application & retrieve application instance.
 */
const app = container.resolve(AuctionMonitorApp);

/**
 * Catch all exceptions not handled and exit with error code.
 */
process.on("uncaughtException", (error: Error) => {
    const logger: ILogger = container.get<ILogger>(DependencyIdentifier.LOGGER);
    logger.error(error.message);
    process.exit(-1);
});

/*
 * Start the application
 */
(async () => {
    await app.start();
})();

