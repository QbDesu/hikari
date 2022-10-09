import { IClientOptions } from "mqtt";
import { createContext, FC, useState } from "react";
import { MQTTConnector } from "./Connector";

export const MQTTContext = createContext<MQTTConnector | undefined>(undefined);
MQTTContext.displayName = "MQTTContext";

export interface MQTTProviderProps {
    children: React.ReactNode;
    url?: string;
    clientOptions?: IClientOptions;
}
export const MQTTProvider: FC<MQTTProviderProps> = (props) => {
    const { children, url, clientOptions } = props;

    const [connector] = useState(new MQTTConnector(url, clientOptions));

    return (
        <MQTTContext.Provider value={connector}>
            {children}
        </MQTTContext.Provider>
    );
};
