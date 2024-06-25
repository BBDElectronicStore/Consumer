import {BankDetails} from "../interfaces/messages/bankDetails";

export class BankService {
    async processPayment(totalCost: number, bankDetails: BankDetails) {
        console.log('Processing payment');
        return false;
    }
}