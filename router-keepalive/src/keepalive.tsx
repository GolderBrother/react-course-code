import React, { createContext, useContext } from 'react';
import { useOutlet, useLocation, matchPath } from 'react-router-dom'
import type { FC, PropsWithChildren, ReactNode } from 'react';

interface KeepAliveLayoutProps extends PropsWithChildren {
    keepPaths: Array<string | RegExp>;
    keepElements?: Record<string, ReactNode>;
    dropByPath?: (path: string) => void;
}

type KeepAliveContextType = Omit<Required<KeepAliveLayoutProps>, 'children'>;

const keepElements: KeepAliveContextType['keepElements'] = {};

export const KeepAliveContext = createContext<KeepAliveContextType>({
    keepPaths: [],
    keepElements,
    dropByPath(path: string) {
        keepElements[path] = null;
    }
});

/**
 * 根据是 string 还是 RegExp 分别做处理，判断路由是否在 keepPaths 内：
 * @param keepPaths 
 * @param path 
 * @returns 
 */
const isKeepPath = (keepPaths: Array<string | RegExp>, path: string) => {
    let isKeep = false;
    // 在 context 中保存所有需要 keepalive 的组件，全部渲染出来，通过路由是否匹配来切换对应组件的显示隐藏
    for (let i = 0; i < keepPaths.length; i++) {
        let item = keepPaths[i];
        if (item === path) {
            isKeep = true;
        }
        if (item instanceof RegExp && item.test(path)) {
            isKeep = true;
        }
        if (typeof item === 'string' && item.toLowerCase() === path) {
            isKeep = true;
        }
    }
    return isKeep;
}

export function useKeepOutlet() {
    const location = useLocation();
    const element = useOutlet();

    const { keepElements, keepPaths } = useContext(KeepAliveContext);
    const isKeep = isKeepPath(keepPaths, location.pathname);

    // 在 context 中保存所有需要 keepalive 的组件，全部渲染出来，通过路由是否匹配来切换对应组件的显示隐藏。
    if (isKeep) {
        // 用 useLocation 拿到当前路由，用 useOutlet 拿到对应的组件
        // 判断下当前路由是否在需要 keepalive 的路由内，是的话就保存到 keepElements
        keepElements![location.pathname] = element;
    }

    return <>
        {/* 渲染所有的 keepElements，如果不匹配就隐藏 */}
        {
            Object.entries(keepElements).map(([pathname, element]) => (
                <div
                    key={pathname}
                    style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden auto' }}
                    className="keep-alive-page"
                    hidden={!matchPath(location.pathname, pathname)}
                >
                    {element}
                </div>
            ))
        }
        {!isKeep && element}
    </>
}

const KeepAliveLayout: FC<KeepAliveLayoutProps> = (props) => {
    const { keepPaths, ...other } = props;

    const { keepElements, dropByPath } = useContext(KeepAliveContext);

    return (
        // 暴露出一个组件，里面用 context.Provider 修改 context 中的值，主要是设置 keepPaths，其余的都用 useContext 从 context 中取。
        <KeepAliveContext.Provider value={{ keepPaths, keepElements, dropByPath }} {...other} />
    )
}

export default KeepAliveLayout;
