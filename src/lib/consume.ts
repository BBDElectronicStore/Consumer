// TODO: find out message type
type MessageHandler = (message: any) => Promise<void>;

export const messageHandlers = new Map<string, MessageHandler>();

export function Consume(messageType: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        messageHandlers.set(messageType, descriptor.value);
    };
}