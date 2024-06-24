import {IRepository} from "./IRepository";
import {DBPool} from "../database/database.pool";
import {Logger} from "../lib/logger";


export class OrderRepository implements IRepository {
    public async placeOrder(quantity: number, customerId: number, correlationId: string) {
        try {
            await DBPool.query('BEGIN');
            const productQuery = 'SELECT price, "VAT" FROM products LIMIT 1';
            const productResult = await DBPool.query(productQuery);

            if (productResult.rows.length === 0) {
                throw new Error('No products found');
            }

            const { price, VAT } = productResult.rows[0];
            const totalCost = quantity * (price + (price * (VAT/100)));

            const insertOrderResult = await DBPool.query(`
              INSERT INTO orders (customer_id, quanity, status_id, total_cost, reference_number)
              VALUES ($1, $2, 1, $3, $4)
              RETURNING order_id
            `, [customerId, quantity, totalCost, correlationId]);
            const orderId = insertOrderResult.rows[0].order_id;
            Logger.debug(`[${correlationId}]Order inserted with ID: ${orderId}`);
            await DBPool.query('COMMIT');
            return totalCost;
        }
        catch (e) {
            await DBPool.query('ROLLBACK');
            console.error('Error inserting order:', e);
            throw e;
        }
    }
}