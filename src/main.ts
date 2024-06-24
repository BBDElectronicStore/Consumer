import {messageHandlers} from "./lib/decorators/handle";
import {HelloConsumer} from "./consumers/hello.consumer";
import {listenToQueue} from "./lib/listen";
import {ElectronicsStoreDefaultConfig} from "./config/electronics";
import {OrderConsumer} from "./consumers/order.consumer";
import {PaymentConsumer} from "./consumers/payment.consumer";

/**
 * Please add your consumers to this array
 * Nothing gets done with the array, but we have to do this
 * Because javascript, IDK ask the guy who made it
 */
const consumers = [
    HelloConsumer,
    OrderConsumer,
    PaymentConsumer
]
listenToQueue(messageHandlers, ElectronicsStoreDefaultConfig).then();