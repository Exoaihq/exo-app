import { ReactElement } from "react";
import { useScratchPadContext } from "../../context/scratchPadContext";
function ScratchPadHeaderItem({
  name,
  icon,
  setActiveTab,
}: {
  name: string;
  icon: ReactElement;
  setActiveTab: (name: string) => void;
}) {
  const { activeTab } = useScratchPadContext();
  const itemClass =
    activeTab === name
      ? "inline-flex p-4 border-b-2 border-transparent rounded-t-lg active dark:text-primary-700 dark:border-primary-700 group"
      : "inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-primary-700 hover:border-primary-700 dark:hover:text-primary-700 group";

  return (
    <li className="mr-2" onClick={() => setActiveTab(name)}>
      <a href="#" className={itemClass} aria-current="page">
        {icon}
        <div className="hidden lg:block">{name}</div>
      </a>
    </li>
  );
}

export default ScratchPadHeaderItem;
