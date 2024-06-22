import {Consume} from "../lib/consume";

export class HelloConsumer {

    @Consume("HELLO_MESSAGE")
    async handleHelloMessage(message: any) {
        console.log("handling hello message");
    }
}