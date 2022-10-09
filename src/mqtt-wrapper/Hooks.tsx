import { IClientPublishOptions, IPublishPacket } from "mqtt";
import { useContext, useEffect, useState } from "react";
import { MQTTContext } from "./Context";
import { TopicListener } from "./utils";

const textDecoders = new Map<string, TextDecoder>();
const textEncoder = new TextEncoder();

export const useMQTTContext = () => {
    const context = useContext(MQTTContext);
    if (!context)
        throw new Error("No MQTTProvider found when calling useMQTTContext.");
    return context;
};

export const useMQTTConnectionState = () => {
    const context = useMQTTContext();
    const [state, setState] = useState(context.client.connected);
    useEffect(() => {
        const onConnect = () => setState(true);
        const onDisconnect = () => setState(false);
        context.client.on("connect", onConnect);
        context.client.on("disconnect", onDisconnect);
        return () => {
            context.client.removeListener("connect", onConnect);
            context.client.removeListener("disconnect", onDisconnect);
        };
    }, [context]);
    return state;
};

type GenericPublishFn<T> = (
    message: T,
    options?: IClientPublishOptions
) => void;

export const useMQTTBytes = (
    topic: string
): [Uint8Array | undefined, GenericPublishFn<Uint8Array>] => {
    const [message, setMessage] = useState<Uint8Array | undefined>(undefined);
    const connector = useMQTTContext();

    useEffect(() => {
        const listener: TopicListener = (_, message) => {
            setMessage(message);
        };

        connector.subscribe(topic, listener);

        return () => {
            connector.unsubscribe(topic, listener);
        };
    }, [topic]);

    return [
        message,
        (value: Uint8Array, options?: IClientPublishOptions) => {
            connector.publish(topic, value, options);
        },
    ];
};

export const useMQTTBoolean = (
    topic: string
): [boolean | undefined, GenericPublishFn<boolean>] => {
    const [message, publishBytes] = useMQTTBytes(topic);
    return [
        message && message.length ? Boolean(message[0]) : undefined,
        (value: boolean, options?: IClientPublishOptions) => {
            publishBytes(new Uint8Array([+value]), options);
        },
    ];
};

export const useMQTTString = (
    topic: string,
    encoding: string = "utf-8"
): [string | undefined, GenericPublishFn<string>] => {
    const [message, publishBytes] = useMQTTBytes(topic);
    if (!textDecoders.has(encoding)) {
        textDecoders.set(encoding, new TextDecoder(encoding));
    }
    const decoder = textDecoders.get(encoding)!;
    return [
        message ? decoder.decode(message!) : undefined,
        (message: string, options?: IClientPublishOptions) => {
            publishBytes(textEncoder.encode(message), options);
        },
    ];
};

export const useMQTTJSON = (
    topic: string,
    errorCallback?: (error: unknown, message: string | undefined) => void
): [any | undefined, GenericPublishFn<any>] => {
    const [message, publishString] = useMQTTString(topic);
    try {
        return [
            message ? JSON.parse(message) : undefined,
            (topic: string, value: any, options?: IClientPublishOptions) => {
                publishString(JSON.stringify(value), options);
            },
        ];
    } catch (error) {
        if (errorCallback) {
            errorCallback(error, message);
        }
        return [
            undefined,
            (value: any, options?: IClientPublishOptions) => {
                publishString(JSON.stringify(value), options);
            },
        ];
    }
};

export const useMQTTPublish = () => {
    const connector = useMQTTContext();

    const publishBytes = (
        topic: string,
        value: Uint8Array,
        options?: IClientPublishOptions
    ) => {
        connector.publish(topic, value, options);
    };
    const publishBoolean = (
        topic: string,
        value: boolean,
        options?: IClientPublishOptions
    ) => {
        publishBytes(topic, new Uint8Array([+value]), options);
    };
    const publishString = (
        topic: string,
        value: string,
        options?: IClientPublishOptions
    ) => {
        publishBytes(topic, textEncoder.encode(value), options);
    };
    const publishJSON = (
        topic: string,
        value: any,
        options?: IClientPublishOptions
    ) => {
        publishString(topic, JSON.stringify(value), options);
    };

    return {
        publishBytes,
        publishBoolean,
        publishString,
        publishJSON,
    };
};
