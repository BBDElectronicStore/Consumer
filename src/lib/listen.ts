import amqp from 'amqplib';
import {MessageHandler} from "./types/MessageHanlder";
import {Logger} from "./logger";

export async function listenToQueue(handlers: Map<string, MessageHandler>, queue: string, queueUrl: string) {
    try {
        const connection = await amqp.connect(queueUrl);
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, {
            durable: true
        });

        Logger.debug(`Waiting for messages from queue: ${queue}`);

        await channel.consume(queue, (msg) => {
            if (msg !== null) {
                const messageName = msg.properties.headers?.name || 'Unnamed Message';
                const messageContent = msg.content.toString();

                Logger.debug(`Received message: ${messageName}`);
                Logger.debug(`Message content: ${messageContent}`);
                const handler = handlers.get(messageName);
                if (handler) {
                    handler(JSON.parse(messageContent));
                } else {
                    Logger.error(`No handler found for message: ${messageName}`);
                }
                channel.ack(msg);
            }
        });
    } catch (error) {
        Logger.error(`Error listening to queue: ${error}`);
    }
}