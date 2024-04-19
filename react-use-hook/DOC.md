# 自定义 hook 练习

组件里的逻辑可以抽成自定义 hook 来复用，在 react-use、ahooks 里也有很多通用 hook。

我们实现了 useMountedState、useLifecycles、useCookie、useHover、useScrolling 这些自定义 hook。

其中要注意的是返回的函数一般都用 useCallback 包裹，这样返回值作为 memo 组件的参数的时候，调用者不用再处理。

再就是绑定事件的 hook 有三种封装方式：

传入 React Element 然后 cloneElement
传入 ref 然后拿到 dom 执行 addEventListener
返回 props 对象或者事件处理函数，调用者自己绑定