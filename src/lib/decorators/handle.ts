import {MessageHandler} from "../types/MessageHanlder";
import {Logger} from "../logger";

export const messageHandlers = new Map<string, MessageHandler>();

export function Handle(messageType: string) {
    return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: unknown[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                Logger.error(`Error handler for ${messageType}`);
                // Should we be pushing to error queue here?
                // IF standard is followed then we can just append _ERR to the message type and route it to the error queue
            }
        }
        messageHandlers.set(messageType, descriptor.value);
    }
}