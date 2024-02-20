# 日历组件

className 和 style 用于修改外层容器的样式，内部用的 flex 布局，只要容器大小变了，内容会自动适应。

dateRender 和 dateInnerConent 是用于修改日期单元格的内容的，比如显示节日、日程安排等。

locale 是切换语言，国际化就是把写死的文案换成从资源包取值的方式，我们创建了 zh-CN 和 en-US 两个资源包，并且可以通过 locale 参数来切换。

通过 createContext 创建 context 对象来保存 locale 配置，然后通过 Provider 修改其中的值，这样子组件里就通过 useContext 把它取出来就知道当前语言了。

日历组件是一个常用组件，而且是经常需要定制的那种，因为各种场景下对它有不同的要求，所以能够自己实现各种日历组件是一个必备技能。