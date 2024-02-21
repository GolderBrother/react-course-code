# React.Children 和它的两种替代方案

用 React.Children 来修改 children，它有 map、forEach、toArray、only、count 等方法。

不建议直接用数组方法来操作，而是用 React.Children 的 api。

原因有三个：
- 用数组的方法需要声明 children 为 ReactNode口 类型，这样就必须传入多个元素才行，而
React.Children 不用
- 用数组的方法不会对 children 做拍平，而 React. Children 会
- 用数组的方法不能做排序，因为chilcdren 的元素是只读的，而用 React. Children.toArray 转
成数组就可以了


当然，Children 的 api 被放到了 legacy 目录，可以用这两种方案来替代：

- 把对 children 的修改封装成一个组件，使用者用它来手动包装
- 声明一个 props 来接受数据，内部基于它来渲染，而且还可以传入render props 让使用者定
制渲染逻辑

不过，这两种替代方案易用性都不如 React.Children，各大组件库也依然大量使用 React.Children 的 api。

所以，遇到需要修改渲染的 children 的情况，用 React.Children 的 api，或是两种替代方案（抽离渲染逻辑为单独组件、传入数据 + render props）都可以。