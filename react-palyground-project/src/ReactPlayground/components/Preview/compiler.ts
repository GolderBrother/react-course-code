import { transform } from "@babel/standalone";
import { Files } from "../../PlaygroundContext";
import { ENTRY_FILE_NAME } from "../../files";
import { PluginObj } from "@babel/core";
import { css2Js, json2Js, jsTransform } from "./transform";
function customResolver(files: Files): PluginObj {
    return {
        visitor: {
            ImportDeclaration(path) {
                const modulePath = path.node.source.value
                if(modulePath.startsWith('.')) {
                    const file = getModuleFile(files, modulePath)
                    if(!file) 
                        return

                    if (file.name.endsWith('.css')) {
                        path.node.source.value = css2Js(file)
                    } else if (file.name.endsWith('.json')) {
                        path.node.source.value = json2Js(file)
                    } else {
                        path.node.source.value = jsTransform(file, files)
                    }
                }
            }
        }
    }
}

/**
 * babel 编译之前，判断下文件内容有没有 import React，没有就 import 一下
 * @param filename 
 * @param code 
 * @returns 
 */
export const beforeTransformCode = (filename: string, code: string) => {
    let _code = code
    const regexReact = /import\s+React/g
    if ((filename.endsWith('.jsx') || filename.endsWith('.tsx')) && !regexReact.test(code)) {
      _code = `import React from 'react';\n${code}`
    }
    return _code
}
export const babelTransform = (
  filename: string,
  code: string,
  files: Files
) => {
  let result = "";
// 如果 App.tsx 的 jsx 内容编译后变成了 React.createElement，但是我们并没有引入 React，这样运行会报错
// 所以我们需要在编译后的代码中自动引入 React
  const newCode = beforeTransformCode(filename, code);
  try {
    // 调用 babel 的 transform 方法进行编译。
    result = transform(newCode, {
      // presets 指定 react 和 typescript，也就是对 jsx 和 ts 语法做处理。
      presets: ["react", "typescript"],
      filename,
      plugins: [customResolver(files)],
      // retainLines 是编译后保持原有行列号不变。
      retainLines: true,
    }).code!;
  } catch (e) {
    console.error("编译出错", e);
  }
  return result;
};

/**
 * 获取导入模块的文件内容
 * @param files
 * @param modulePath
 * @returns
 */
const getModuleFile = (files: Files, modulePath: string) => {
  // 如果去掉 ./ 之后，剩下的不包含 . 比如 ./App 这种，那就要补全 App 为 App.tsx 等。
  let moduleName = modulePath.split("./").pop() || "";
  // 过滤下 files 里的 js、jsx、ts、tsx 文件，如果包含这个名字的模块，那就按照补全后的模块名来查找 file。
  if (!moduleName.includes(".")) {
    const realModuleName = Object.keys(files)
      .filter((key) => {
        return (
          key.endsWith(".ts") ||
          key.endsWith(".tsx") ||
          key.endsWith(".js") ||
          key.endsWith(".jsx")
        );
      })
      .find((key) => {
        return key.split(".").includes(moduleName);
      });
    if (realModuleName) {
      moduleName = realModuleName;
    }
  }
  return files[moduleName];
};

export const compile = (files: Files) => {
  const main = files[ENTRY_FILE_NAME];
  return babelTransform(ENTRY_FILE_NAME, main.value, files);
};
