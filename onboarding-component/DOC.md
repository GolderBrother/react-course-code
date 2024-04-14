# OnBoarding 组件

实现了 OnBoarding 组件，就是 antd5 里加的 Tour 组件。

antd 里是用 4 个 rect 元素实现的，我们是用一个 div 设置 width、height、四个方向不同的 border-width 实现的。

通过设置 transition，然后改变 width、height、border-width 就可以实现 mask 移动的动画。

然后我们在外层封装了一层，加上了上一步下一步的切换。

并且用 ResizeObserver 在窗口改变的时候重新计算 mask 样式。

此外，还要注意，mask 需要在 dom 树渲染完之后才能拿到 dom 来计算样式，所以需要 useEffect + setState 来触发一次额外渲染。