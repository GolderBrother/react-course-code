# 当组件进入 dom 和从 dom 中移除的时候，发生的动画就叫做过渡动画。

react-spring 有 useTransition 这个 hook 来实现过渡动画，我们也可以用 react-transition-group 这个包来实现。

这两个包能实现一样的功能，但是思路不同。

react-spring 有内置的动画效果，所以只要用 useTransition 设置 from、enter、leave 时的 style，它就会在数据变化的时候触发过渡动画。

而 react-transition-group 是通过 className 的修改来实现过渡动画，而且要自己用 transition 的 css 来控制动画效果：

进入的时候会触发 enter、enter-active、enter-done 的 className 切换

离开的时候是 exit、exit-active、exit-done 的切换

如果设置了 appear 参数，刚出现的时候，还会有 appear、appear-active、appear-done 的切换。

它有 Transition、CSSTransition、TransitionGroup、SwitchTransition 这 4 个组件。

常用的就是 CSSTransition 和 TransitionGroup，这俩是用来做单个元素的过渡动画和多个元素的过渡动画的。

而在 react-spring 里，单个元素的过渡动画和多个元素的过渡动画写法没区别。

具体用哪种方案来实现过渡动画都行，个人感觉 react-spring 更好用一些。