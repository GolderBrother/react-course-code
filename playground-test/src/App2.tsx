import { transform } from "@babel/standalone";
import type { PluginObj } from "@babel/core";

function App() {
  const code1 = `
    function add(a, b) {
        return a + b;
    }
    export { add };
  `;

  const url = URL.createObjectURL(
    new Blob([code1], {
      type: "application/javascript",
    })
  );
  const transformImportSourcePlugin: PluginObj = {
    visitor: {
      ImportDeclaration: (path) => {
        path.node.source.value = url;
      },
    },
  };
  const code2 = `
    import { add } from './add';
    const res = add(1, 2);
    console.log('res', res);
  `;
  // 点击编译按钮的时候，拿到内容用 babel.transform 编译，指定 typescript 和 react 的 preset
  const handleCompile = (code: string) => {
    if (!code) return;
    const res = transform(code, {
      presets: ["react", "typescript"],
      filename: "james.tsx",
      plugins: [transformImportSourcePlugin],
    });
    const newCode = res.code;
    console.log("transform after newCode is: ", newCode);
  };
  return <button onClick={() => handleCompile(code2)}>编译</button>;
}

export default App;
