import {
    IClientOptions,
    IClientPublishOptions,
    IPublishPacket,
    MqttClient,
} from "mqtt";
import { matchMqttWildcardTopic, TopicListener } from "./utils";

declare global {
    interface Window {
        mqtt: typeof import("mqtt");
    }
}

export class MQTTConnector {
    private _client: MqttClient;
    private listeners = new Map<string, TopicListener[]>();

    constructor(url?: string, options?: IClientOptions) {
        this._client = url
            ? window.mqtt.connect(url, options)
            : window.mqtt.connect(options!);
        this._client.on("connect", () => {
            console.info("MQTTConnector: Connected to MQTT broker");
        });
        this._client.on("message", (topic, message) => {
            this.onMessage(topic, message);
        });
    }

    private onMessage(topic: string, message: Uint8Array) {
        for (const [subscribtionTopic, listeners] of this.listeners) {
            if (
                subscribtionTopic === topic ||
                matchMqttWildcardTopic(subscribtionTopic, topic)
            ) {
                for (const listener of listeners) {
                    listener(topic, message);
                }
            }
        }
    }

    public subscribe(topic: string, listener: TopicListener) {
        if (this.listeners.has(topic)) {
            this.listeners.get(topic)!.push(listener);
        } else {
            this.listeners.set(topic, [listener]);
        }
        this._client.subscribe(topic);
    }

    public unsubscribe(topic: string, listener: TopicListener) {
        if (this.listeners.has(topic)) {
            this.listeners.set(
                topic,
                this.listeners.get(topic)!.filter((l) => l !== listener)
            );
        }
        // TODO: Unsubscribe from topic if no listeners are left
    }

    public publish(
        topic: string,
        message: string | Uint8Array,
        options?: IClientPublishOptions
    ) {
        // options are optional, but the type definition of MQTT.js is broken
        this._client.publish(topic, message as Buffer, options!);
    }

    public get client() {
        return this._client;
    }
}
