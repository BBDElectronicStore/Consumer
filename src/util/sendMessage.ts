import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import {IConfig} from "../config/IConfig";

export async function sendMessage<T>(
    message: T,
    messageType: string,
    config: IConfig
) {
    const sqsClient = new SQSClient({
        region: config.REGION,
        credentials: {
            accessKeyId: config.ACCESS_KEY_ID,
            secretAccessKey: config.SECRET_ACCESS_KEY
        }
    });

    const queueUrl = `${config.QUEUE_URL}/queue/${config.MAIN_QUEUE}`;

    const sendCommand = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({
            name: messageType,
            content: message
        })
    });

    try {
        const response = await sqsClient.send(sendCommand);
        return response.MessageId!;
    } catch (error) {}
}