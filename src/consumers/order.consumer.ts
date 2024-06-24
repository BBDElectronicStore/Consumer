import {Handle} from "../lib/decorators/handle";
import {IConsume} from "../lib/interfaces/IConsume";
import {OrderMessage} from "../messages/order.message";
import {sendMessage} from "../util/sendMessage";
import {ElectronicsStoreDefaultConfig} from "../config/electronics";
import {PlaceOrderCommand} from "../commands/placeOrder.command";
import {OrderRepository} from "../repositories/order.repository";
import {Logger} from "../lib/logger";


export class OrderConsumer implements IConsume<void, [message: any]>{

    @Handle(OrderMessage.default)
    async successHandler(message: any) {
        Logger.debug(`[${message.correlationId} placing order for customer: ${message.customerId}`);
        const placeOrderCommand = new PlaceOrderCommand(new OrderRepository());
        const orderId = await placeOrderCommand.execute(message.customerId, message.quantity, message.correlationId);
        if(orderId === undefined) {
            throw new Error(`[${message.correlationId}] Error placing order`)
        }
        Logger.debug(`[${message.correlationId}] Order placed successfully with order id: ${orderId}`);
        // send message to payment service with correlation guid
        await sendMessage(
            {
                orderId: orderId,
                customerId: message.customerId,
                totalCost: message.totalCost
            },
            "PROCESS_PAYMENT",
            ElectronicsStoreDefaultConfig,
            message.correlationId
        )
    }

    // Do we need error queues to replay messages pushed to the error queue
    @Handle(OrderMessage.err)
    async errorHandler(message: any) {
        console.log("handling hello message err");
    }
}