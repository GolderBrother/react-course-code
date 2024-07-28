import { Allotment } from "allotment";
import 'allotment/dist/style.css';
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import Preview from "./components/Preview";
import { useContext } from "react";
import { PlaygroundContext } from "./PlaygroundContext";
import './index.scss'

export default function ReactPlayground() {
    const { theme} = useContext(PlaygroundContext)
    // 主题切换就是在根元素加一个 .light、.dark 的 className，里面声明 css 变量，因为 css 变量可以在子元素里生效，子元素写样式基于这些变量，那切换了 className 也就切换了这些变量的值，从而实现主题切换
    return <div style={{ height: '100vh', display: 'flex', flexDirection: 'column'}} className={theme}>
        <Header />
        <Allotment defaultSizes={[100, 100]}>
            <Allotment.Pane minSize={500}>
                <CodeEditor />
            </Allotment.Pane>
            <Allotment.Pane minSize={0}>
                <Preview />
            </Allotment.Pane>
        </Allotment>
    </div>
}
