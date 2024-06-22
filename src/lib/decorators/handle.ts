import {MessageHandler} from "../types/MessageHanlder";

export const messageHandlers = new Map<string, MessageHandler>();

export function Handle(messageType: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        messageHandlers.set(messageType, descriptor.value);
    }
}