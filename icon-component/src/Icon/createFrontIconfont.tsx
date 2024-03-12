import { FunctionComponent } from "react";
import { Icon, IconProps } from ".";
import React from "react";

const loadedSet = new Set<string>();
const isValidScriptUrl = (scriptUrl: string) => {
    return Boolean(
        typeof scriptUrl === 'string'
        && scriptUrl.length
        && !loadedSet.has(scriptUrl)
    );
}

/**
 * createFromIconfont 会传入 scriptUrl，我们在 document.body 上添加 <script> 标签引入它。
 * @param scriptUrl 
 * @returns 
 */
export function createFromIconfont(scriptUrl: string): FunctionComponent<IconProps> {
    if (
        isValidScriptUrl(scriptUrl)
    ) {
        const script = document.createElement("script");
        script.setAttribute('src', scriptUrl);
        script.async = true;
        script.setAttribute('data-namespace', scriptUrl);
        document.body.appendChild(script);
        // 当然，如果加载过的就不用再次加载了，所以用 Set 来记录下。
        loadedSet.add(scriptUrl);
    };

    const Iconfont = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
        const { type, viewBox = '0 0 1024 1024', ...restProps } = props;

        return (
            <Icon {...restProps} ref={ref} viewBox={viewBox}>
                {/* 用的时候使用 <use xlinkHref="#type" > 引用。 */}
                {type ? <use xlinkHref={`#${type}`} /> : null}
            </Icon>
        );
    });
    // Iconfont.displayName = 'Iconfont';

    return Iconfont;
}