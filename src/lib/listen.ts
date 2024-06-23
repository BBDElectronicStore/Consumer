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

        await channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const messageName = msg.properties.headers?.name || 'Unnamed Message';
                const messageContent = msg.content.toString();
                const replyTo = msg.properties.replyTo;
                const correlationId = msg.properties.correlationId;

                Logger.debug(`[${correlationId}] ${messageName}`);
                Logger.debug(`[${correlationId}] Body: ${messageContent}`);
                const handler = handlers.get(messageName);
                if (handler) {
                    try {
                        const result = await handler(JSON.parse(messageContent));

                        if (replyTo) {
                            channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(result)), {
                                correlationId: correlationId
                            });
                            Logger.debug(`[${correlationId}] response: ${result}`);
                        }
                    } catch (error) {
                        Logger.error(`Error processing message: ${error}`);
                        if (replyTo) {
                            channel.sendToQueue(replyTo, Buffer.from(JSON.stringify({error: error})), {
                                correlationId: correlationId
                            });
                        }
                    }
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