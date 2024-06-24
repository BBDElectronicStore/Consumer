import {ICommand} from "./ICommand";
import {OrderRepository} from "../repositories/order.repository";


export class PlaceOrderCommand implements ICommand<any, [customerId: number, quantity: number, correlationId: string]> {

    constructor(private readonly repository: OrderRepository) {}

    execute(customerId: number, quantity: number, correlationId: string) {
        console.log(customerId, quantity, correlationId);
        if(this.validate(customerId, quantity, correlationId))
            return this.repository.placeOrder(quantity, customerId, correlationId);
        return undefined;
    }

    validate(customerId: number, quantity: number, correlationId: string): boolean {
        if(!customerId || !quantity || !correlationId)
            return false;
        return !(customerId < 0 || quantity < 0);
    }
}