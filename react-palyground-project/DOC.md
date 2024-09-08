## 1、布局和代码编辑器

布局主要是用 allotment 实现的 split-pane，两边可以通过拖动改变大小。

然后集成 @monaco-editor/react 实现的编辑器。

在 onMount 时添加 cmd + j 的快捷键来做格式化，并且设置了 ts 的 compilerOptions。

此外，还用 @typescript/ata 包实现了代码改变时自动下载 dts 类型包的功能。

这样，在编辑器里写代码就有 ts 类型提示了。


## 2、多文件切换

在 Context 中保存全局数据，比如 files、selectedFileName，还有对应的增删改的方法。

对 Context.Provider 封装了一层来注入初始化数据和方法，提供了 initFiles 的信息。

然后在 FileNameList 里读取 context 里的 files 来渲染文件列表。

点击 tab 的时候切换 selectedFileName，从而切换编辑器的内容。

这样，多文件的切换和编辑就完成了。

## 3、babel 编译、iframe 预览

使用 @babel/standalone 做的 tsx 代码的编译，编译过程中需要对 .tsx、.css、.json 等模块的 import 做处理，变成 blob url 的方式。

tsx 模块直接用 babel 编译，css 模块包一层代码加到 head 的 style 标签里，json 包一层代码直接 export 即可。

### 1、tsx
```ts
import { File, Files } from '../../../PlaygroundContext';
import { babelTransform } from '../compiler';

/**
 * ts 文件的处理就是用 babel 编译下，然后用 URL.createObjectURL 把编译后的文件内容作为 url
 * @param file 
 * @param files 
 * @returns 
 */
export const jsTransform = (file: File, files: Files) => {
    return URL.createObjectURL(
        new Blob([babelTransform(file.name, file.value, files)], {
            type: 'application/javascript',
        })
    )
}
```
### 2、css

```ts
import { File } from '../../../PlaygroundContext';

/**
 * css 文件，是要通过 js 代码把它添加到 head 里的 style 标签里
 * @param file 
 * @returns 
 */
export const css2Js = (file: File) => {
    const randomId = new Date().getTime()
    const js = `
(() => {
    const stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)

    const styles = document.createTextNode(\`${file.value}\`)
    stylesheet.innerHTML = ''
    stylesheet.appendChild(styles)
})()
    `
    return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}

```

### 3、json

```ts
import { File } from '../../../PlaygroundContext';
/**
 * json 文件的处理就是把 export 一下这个 json，然后作为 blob url 即可
 * @param file 
 * @returns 
 */
export const json2Js = (file: File) => {
    const js = `export default ${file.value}`
    return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}
```

对于 react、react-dom/client 这种，用浏览器的 import maps 来引入。

```json
{
    "imports": {
        "react": "https://esm.sh/react@18.2.0",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0"
    }
}
```

之后把 iframe.html 的内容替换 import maps 和 src 部分后，同样用 blob url 设置为 iframe 的 src 就可以了。

```ts
const getIframeUrl = () => {
    console.log(files);
    // 替换其中的 import maps 和 src 的内容。
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${files[IMPORT_MAP_FILE_NAME]?.value}</script>`
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>`
      );
    // 之后创建 blob url 设置到 iframe 的 src。
    return URL.createObjectURL(new Blob([res], { type: "text/html" }));
  };
  const [iframeUrl, setIframeUrl] = React.useState<string>(
    getIframeUrl() || ""
  );
  useEffect(() => {
    // react、react-dom/client 的包通过 import maps 引入
    // ./App.tsx、./App.css 或者 xx.json 之类的依赖通过 blob url 引入
    // 当 import maps 的内容或者 compiledCode 的内容变化的时候，就重新生成 blob url。
    setIframeUrl(getIframeUrl());
  }, [files]);
```

这样就能实现浏览器里的编译和预览。