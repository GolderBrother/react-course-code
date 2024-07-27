import React, { useContext, useEffect } from "react";
import { PlaygroundContext } from "../../PlaygroundContext";
import { compile } from "./compiler";
import iframeRaw from "./iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "../../files";

export default function Preview() {
  const { files } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = React.useState<string>("");

  const getIframeUrl = () => {
    console.log(files);
    // 替换其中的 import maps 和 src 的内容。
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
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
    const compiledCodeData = compile(files);
    setCompiledCode(compiledCodeData);
    // 当 import maps 的内容或者 compiledCode 的内容变化的时候，就重新生成 blob url。
    setIframeUrl(getIframeUrl());
  }, [files]);
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <iframe
        src={iframeUrl}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      ></iframe>
    </div>
  );
}
