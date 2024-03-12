import { useState } from "react";
import { MessageProps, Position } from ".."

type MessageList = {
    top: MessageProps[],
    bottom: MessageProps[],
}

const initialState = {
    top: [],
    bottom: []
};

let count = 1;
export function getId(messageProps: MessageProps) {
    if (messageProps.id) return messageProps.id;
    count += 1;
    return count; // 假设id是唯一的
}

export function getMessagePosition(messageList: MessageList, id: number) {
    // 遍历 top 和 bottom 数组，查找下有没有对应的 Message
    for (const [position, list] of Object.entries(messageList)) {
        if (list.find((message) => message.id === id)) return position as Position;
    }
}

export function findMessage(messageList: MessageList, id: number) {
    const position = getMessagePosition(messageList, id);
    const index = position ? messageList[position].findIndex((message) => message.id === id) : -1;
    return { position, index };
}

function useStore(defaultPosition: Position) {
    const [messageList, setMessageList] = useState<MessageList>(initialState);
    const operate = {
        messageList,
        /**
         *  添加一个元素
         * @param messageProps 
         * @returns 
         */
        add: (messageProps: MessageProps) => {
            // 生成一个新的 id
            const id = getId(messageProps);
            // 添加一个元素
            setMessageList((preState) => {
                if (messageProps?.id) {
                    // 先根据 id 查找有没有已有的 message，如果有就不添加，直接返回之前的
                    const position = getMessagePosition(preState, messageProps.id);
                    if (position) return preState;
                }

                const position = messageProps.position || defaultPosition;
                const isTop = position.includes('top');
                // top 的在前面插入一个元素，bottom 的在后面插入一个元素
                const messages = isTop
                    ? [{ ...messageProps, id }, ...(preState[position] ?? [])]
                    : [...(preState[position] ?? []), { ...messageProps, id }];

                return {
                    ...preState,
                    [position]: messages,
                };
            });
            return id;
        },
        /**
         * 找到对应的 message 修改信息
         * @param id 
         * @param messageProps 
         * @returns 
         */
        update: (id: number, messageProps: MessageProps) => {
            if (!id) return;
            
            setMessageList((preState) => {
                const nextState = { ...preState };
                const { position, index } = findMessage(nextState, id);

                if (position && index !== -1) {
                    nextState[position][index] = {
                        ...nextState[position][index],
                        ...messageProps,
                    };
                }

                return nextState;
            });
        },
        /**
         * 找到对应的数组，从中删除这个元素
         * @param id 
         */
        remove: (id: number) => {
            setMessageList((prevState) => {
                const position = getMessagePosition(prevState, id);

                if (!position) return prevState;
                return {
                    ...prevState,
                    [position]: prevState[position].filter((notice) => notice.id !== id),
                };
            });
        },

        clearAll: () => {
            setMessageList({ ...initialState });
        },
    };
    return operate;
}

export default useStore;