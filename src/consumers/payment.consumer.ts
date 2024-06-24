import {Handle} from "../lib/decorators/handle";
import {IConsume} from "../lib/interfaces/IConsume";
import {PaymentMessage} from "../messages/payment.message";


export class OrderConsumer implements IConsume<void, [message: any]>{

    @Handle(PaymentMessage.default)
    async successHandler(message: any) {
        console.log(message);
        return undefined;
    }

    // Do we need error queues to replay messages pushed to the error queue
    @Handle(PaymentMessage.err)
    async errorHandler(message: any) {
        console.log("handling hello message err");
    }
}