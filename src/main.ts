import {messageHandlers} from "./lib/decorators/handle";
import {HelloConsumer} from "./consumers/hello.consumer";
import {listenToQueue} from "./lib/listen";
import {ElectronicsStoreDefaultConfig} from "./config/electronics";

/**
 * Please add your consumers to this array
 * Nothing gets done with the array, but we have to do this
 * Because javascript, IDK ask the guy who made it
 */
const consumers = [
    HelloConsumer
]
listenToQueue(messageHandlers, ElectronicsStoreDefaultConfig).then();