# Ref 的实现原理

函数组件里用 useRef 保存 dom 引用或者自定义的值，而在类组件里用 createRef
forwardRef 可以转发子组件的 ref 给父组件，还可以用 useImperativeHandle 来修改转发的 ref 的值

## react 的实现流程

通过 jsx 写的代码会编译成 render function，执行产生 vdom，也就是 React Element 对象的树。

react 分为 render 和 commit 两个阶段:

### 1、render 阶段
（1）会递归做 vdom 转 fiber
（2）beginWork 里递归进行 reconcile、reconcileChildren
（3）completeWork 里创建 dom，记录增删改等 tag 和其他 effect

### 2、commit 阶段

遍历 fiber 链表，做三轮处理，这三轮分别叫做 `before mutation、mutation、layout，mutation` 阶段会根据 `tag` 做 `dom` 增删改。

## 总结

我们平时会用到 createRef、useRef、forwardRef、useImperativeHandle 这些 api，而理解它们的原理需要熟悉 react 的运行流程，也就是 render（beginWork、completeWork） + commit（before mutation、mutation、layout）的流程。

render 阶段处理到原生标签的也就是 HostComponent 类型的时候，如果有 ref 属性会在 fiber.flags 里加一个标记。

commit 阶段会在 layout 操作完 dom 后遍历 fiber 链表更新 HostComponent 的 ref，也就是把 fiber.stateNode 赋值给 ref.current。

react 并不关心 ref 是哪里创建的，用 createRef、useRef 创建的，或者 forwardRef 传过来的都行，甚至普通对象也可以，createRef、useRef 只是把普通对象 Object.seal 了一下。

forwarRef 是创建了单独的 React Element 类型，在 beginWork 处理到它的时候做了特殊处理，也就是把它的 ref 作为第二个参数传递给了函数组件，这就是它 ref 转发的原理。

useImperativeHandle 的底层实现就是 useEffect，只不过执行的函数是它指定的，bind 了传入的 ref 和 create 函数，这样在 layout 阶段调用 hook 的 effect 函数的时候就可以更新 ref 了。

理解了 react 渲染流程之后，很多特性只是其中多一个 switch case 的分支而已，就比如 ref