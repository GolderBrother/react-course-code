# 基于 React Router 实现 keepalive
路由切换会销毁对应的组件，但很多场景我们希望路由切换组件不销毁，也就是 keepalive。

react router 并没有实现这个功能，需要我们自己做。

我们在 context 中保存所有需要 keepalive 的组件，然后渲染的时候全部渲染出来，通过路由是否匹配来切换显示隐藏。

这样实现了 keepalive。

这个功能是依赖 React Router 的 useLocation、useOutlet、matchPath 等 api 实现的，和路由功能密不可分。

