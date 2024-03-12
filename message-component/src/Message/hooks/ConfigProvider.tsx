import { PropsWithChildren, RefObject, createContext, useRef } from "react";
import { MessageProvider, MessageRef } from "..";

interface ConfigProviderProps {
    messageRef?: RefObject<MessageRef>
}

// 用 createContext 创建 context，然后在其中放了 messageRef，这个 messageRef 的值是在 MessageProvider 设置的
export const ConfigContext = createContext<ConfigProviderProps>({});

export function ConfigProvider(props: PropsWithChildren) {

    const { children } = props;

    const messageRef = useRef<MessageRef>(null);

    return (
        <ConfigContext.Provider value={{ messageRef }}>
            <MessageProvider ref={messageRef}></MessageProvider>
            {children}
        </ConfigContext.Provider>
    );
}