import {messageHandlers} from "./lib/decorators/handle";
import {HelloConsumer} from "./consumers/hello.consumer";

console.log(messageHandlers)
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