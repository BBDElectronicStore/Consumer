import {ICommand} from "./ICommand";
import {OrderRepository} from "../repositories/order.repository";


export class FulfilOrderCommand implements ICommand<Promise<any>, [correlationId: string]> {

    constructor(private readonly repository: OrderRepository) {}

    async execute(correlationId: string) {
        if(!this.validate(correlationId))
            throw new Error(`Invalid GUID ${correlationId}`);
        return 1;
    }

    validate(correlationId: string): boolean {
        return !(!correlationId || correlationId.length === 0);
    }
}