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
              INSERT INTO orders (customer_id, quantity, status_id, total_cost, reference_number)
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

    public async updateOrderStatus(correlationId: string, status: string) {
        try {
            await DBPool.query('BEGIN');
            const updateOrderResult = await DBPool.query(`
              UPDATE orders
              SET status_id = (SELECT status_id FROM status WHERE status_name = $1)
              WHERE reference_number = $2
            `, [status, correlationId]);
            Logger.debug(`[${correlationId}]Order status updated to ${status}`);
            await DBPool.query('COMMIT');
            return updateOrderResult.rowCount;
        }
        catch (e) {
            await DBPool.query('ROLLBACK');
            console.error('Error updating order status:', e);
            throw e;
        }
    }

    public async getOrderStatus(correlationId: string): Promise<string> {
        try {
            const res = await DBPool.query(`
              SELECT 
                o."order_id",
                c."name" AS customer_name,
                o."quantity",
                o."total_cost",
                o."reference_number",
                s."status_name" AS order_status
              FROM 
                "orders" o
              JOIN 
                "customers" c ON o."customer_id" = c."customer_id"
              JOIN 
                "status" s ON o."status_id" = s."status_id"
              WHERE 
                o."reference_number" = $1;
            `, [correlationId]);
            if (res.rows.length === 0) {
                throw new Error(`Order not found for ${correlationId}`);
            }
            return res.rows[0].order_status;
        }
        catch (e) {
            console.error('Error getting order status:', e);
            throw e;
        }
    }
}