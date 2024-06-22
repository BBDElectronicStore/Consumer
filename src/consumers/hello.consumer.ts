import {Handle} from "../lib/decorators/handle";
import {HelloMessage} from "../messages/hello.message";
import {IConsume} from "../lib/interfaces/IConsume";

export class HelloConsumer implements IConsume<void, [message: any]>{

    @Handle(HelloMessage.default)
    async successHandler(message: any) {
        console.log("handling hello message");
    }

    // Do we need error queues to replay messages pushed to the error queue
    @Handle(HelloMessage.err)
    async errorHandler(message: any) {
        console.log("handling hello message err");
    }
}