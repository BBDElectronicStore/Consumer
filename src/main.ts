import {messageHandlers} from "./lib/decorators/handle";
import {HelloConsumer} from "./consumers/hello.consumer";

/**
 * Please add your consumers to this array
 * Nothing gets done with the array but we have to do this
 * Because javascript, idk ask the guy who made it
 */
const consumers = [
    HelloConsumer
]
const messageType = 'HELLO_MESSAGE'
const handler = messageHandlers.get(messageType)
if(handler) {
    handler('hello')
}
else {
    console.error(`No handler found for message type: ${messageType}`)
}