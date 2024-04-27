# 布局和代码编辑器

布局主要是用 allotment 实现的 split-pane，两边可以通过拖动改变大小。

然后集成 @monaco-editor/react 实现的编辑器。

在 onMount 时添加 cmd + j 的快捷键来做格式化，并且设置了 ts 的 compilerOptions。

此外，还用 @typescript/ata 包实现了代码改变时自动下载 dts 类型包的功能。

这样，在编辑器里写代码就有 ts 类型提示了。