import {Handle} from "../lib/decorators/handle";
import {IConsume} from "../lib/interfaces/IConsume";
import {PaymentMessage} from "../messages/payment.message";
import {payment} from "../interfaces/messages/payment";
import {BankService} from "../services/bank.service";
import {Logger} from "../lib/logger";
import {DenyOrderCommand} from "../commands/denyOrder.command";
import {OrderRepository} from "../repositories/order.repository";
import {FulfilOrderCommand} from "../commands/fulfilOrderCommand";


export class PaymentConsumer implements IConsume<payment, payment> {

    @Handle(PaymentMessage.default)
    async successHandler(message: payment) {
        const bankService = new BankService();
        Logger.debug(`[${message.orderRef}] processing payment for order`);
        const paymentSuccess = await bankService.processPayment(message.totalCost, message.bankDetails);
        if(paymentSuccess) {
            const command = new FulfilOrderCommand(new OrderRepository());
            await command.execute(message.orderRef);
        }
        else {
            const command = new DenyOrderCommand(new OrderRepository());
            await command.execute(message.orderRef);
        }
    }

    @Handle(PaymentMessage.err)
    async errorHandler(message: payment) {
        console.log("handling hello message err");
    }
}