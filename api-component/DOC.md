# 三个简单组件的封装

实现了三个 react 组件，它们是对 api 的简单封装。

直接用这些 api 也挺简单，但是封装一下会多一些额外的好处。

- Portal 组件：对 createPortal 的封装，多了根据 string 选择 attach 节点，自动创建 container 的 dom 的功能

- MutateObserver 组件：对 MutationObserver 的封装，通过 cloneElement 实现了内部自动获取 ref 然后监听的功能，省去了调用方获取 ref 的麻烦。

- CopyToClipboard 组件：对 copy-to-clipboard 包的封装，不用侵入元素的 onClick 处理函数，只是额外多了复制的功能

这三个 api，直接用也是很简单的，可封装也可不封装。