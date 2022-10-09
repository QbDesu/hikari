export const matchMqttWildcardTopic = (
    subscription: string,
    topic: string
): boolean => {
    let subscription_levels = subscription.split("/");
    let topic_levels = topic.split("/");

    for (let i = 0; i < subscription_levels.length; i++) {
        let sub_level = subscription_levels[i];
        if (sub_level === "#") return true;
        if (sub_level !== topic_levels[i] && sub_level !== "+") {
            return false;
        }
    }

    return subscription_levels.length === topic_levels.length;
};

export type TopicListener = (topic: string, value: Uint8Array) => void;
