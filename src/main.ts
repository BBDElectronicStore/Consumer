import {messageHandlers} from "./lib/decorators/handle";
import {HelloConsumer} from "./consumers/hello.consumer";
import {listenToQueue} from "./lib/listen";
import {Logger} from "./lib/logger";

/**
 * Please add your consumers to this array
 * Nothing gets done with the array, but we have to do this
 * Because javascript, IDK ask the guy who made it
 */
const consumers = [
    HelloConsumer
]
const mainQueue = process.env.MAIN_QUEUE;
const queueUrl = process.env.QUEUE_URL;
if (!mainQueue) {
    Logger.error('No main queue specified. Exiting');
    process.exit(1);
}
if (!queueUrl) {
    Logger.error('No queue url specified. Exiting');
    process.exit(1);
}
listenToQueue(messageHandlers, mainQueue, queueUrl).then();