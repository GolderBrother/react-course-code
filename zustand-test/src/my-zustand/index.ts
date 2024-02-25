import {useSyncExternalStore } from "react";

const createStore = (createState: (arg0: (partial: (arg0: any) => any, replace: any) => void, arg1: () => any, arg2: { setState: (partial: (arg0: any) => any, replace: any) => void; getState: () => any; subscribe: (listener: Function) => () => void; destroy: () => void; }) => any) => {
    let state: any;
    const listeners = new Set();
    /**
     * 修改状态
     * @param partial 
     * @param replace 
     */
    const setState = (partial: (arg0: any) => any, replace: any) => {
        const nextState = typeof partial === 'function' ? partial(state) : partial;

        if (!Object.is(nextState, state)) {
            const previousState = state;

            if (!replace) {
                state = (typeof nextState !== 'object' || nextState === null)
                    ? nextState
                    : Object.assign({}, state, nextState);
            } else {
                state = nextState;
            }
            listeners.forEach((listener: any) => listener(state, previousState));
        }
    };
    /**
     *  添加监听器
     * @param listener 
     * @returns 
     */
    const subscribe = (listener: Function) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    }

    /**
     * 读取状态
     * @returns 
     */
    const getState = () => state;
    const destroy = () => {
        listeners.clear();
    }

    const api = { setState, getState, subscribe, destroy };
    state = createState(setState, getState, api)

    return api;
}

// function useStore(api, selector: Function) {
//     // 用 useState 设置随机数来触发渲染。
//     const [,forceRender ] = useState(0);
//     useEffect(() => {
//         // 监听 state 的变化，变了之后，根据新旧 state 调用 selector 函数的结果，来判断是否需要重新渲染。
//         api.subscribe((state, prevState) => {
//             const newObj = selector(state);
//             const oldObj = selector(prevState);

//             if(newObj !== oldObj) {
//                 forceRender(Math.random());
//             }       
//         })
//     }, []);
//     return selector(api.getState());
// }
function useStore(api: {
    setState: (partial: any, replace: any) => void;
    getState: () => any;
    subscribe: (listener: Function) => () => void;
    destroy: () => void;
}, selector: Function) {
    function getState() {
        return selector(api.getState());
    }

    // 这个 hook 用来定义外部 store 的，store 变化以后会触发 rerender
    return useSyncExternalStore(api.subscribe, getState)
}

export const create = (createState: any) => {
    const api = createStore(createState)

    const useBoundStore = (selector: Function) => useStore(api, selector)

    Object.assign(useBoundStore, api);

    return useBoundStore
}