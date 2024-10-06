import { Header } from "./components/Header";
import { useComponentsStore } from "./stores/components";
import { Edit } from "./components/Edit";
import { Preview } from "./components/Preview";

export default function LowcodeEditor() {
  const { mode } = useComponentsStore();
  return (
    <div className="h-[100vh] flex flex-col">
      <div className="h-[60px] flex items-center border-b-[1px] border-[#000]">
        <Header />
      </div>
      {mode === "edit" ? <Edit /> : <Preview />}
    </div>
  );
}
