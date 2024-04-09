# mini react

我们 React 的渲染流程来实现了下 mini react。

JSX 转 render function 这步是 babel 或 tsc 等编译器做的。

我们实现 React.createElement 函数，那执行后返回的就是 React Element 树，也就是 vdom。

通过 requestIdleCallback 在空闲时执行 React Element 转 fiber 的 reconcile 流程。

按照函数组件 FunctionComponent 或者原生标签 HostComponent 分别执行函数或者创建 dom。

reconcile 到子节点的时候要和 alternate 对比，判断是新增、修改还是删除，打上标记。

这个过程中如果调用了 useState 或者 useEffect 会在对应 fiber 节点的 hooks 数组上添加一些元素。

之后进入 commit 阶段，从根节点开始遍历 fiber 链表，根据标记来执行 dom 的增删改，以及执行 effect 函数。

然后 useState 的 setState 会设置新的 nextUnitOfWork，从而触发新的一轮渲染流程。

这样，和 React 的真实渲染流程类似的 mini react 就完成了。

