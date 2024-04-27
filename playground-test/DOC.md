分析了下 react playground 的实现思路。

编辑器部分用 @monaco-editor/react 实现，然后用 @babel/standalone 在浏览器里编译。


编译过程中用自己写的 babel 插件实现 import 的 source 的修改，变为 URL.createObjectURL + Blob 生成的 blob url，把模块内容内联进去。

对于 react、react-dom 这种包，用 import maps 配合 esm.sh 网站来引入。

因此，对于内部模块以及第三方以来的解析问题，解决方案如下：

（1）如何解析编辑器里写的 ./Aaa.tsx 这种模块？
使用用 Blob + URL.createBlobURL

（2）如何引入 react、react-dom 这种模块？
使用import maps + esm.sh 来做。

然后用 iframe 预览生成的内容，url 同样是把内容内联到 src 里，生成 blob url。