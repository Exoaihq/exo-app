import { ReactElement } from "react";

function ScratchPadHeaderItem({
  activeTab,
  name,
  icon,
  setActiveTab,
}: {
  activeTab: string;
  name: string;
  icon: ReactElement;
  setActiveTab: (name: string) => void;
}) {
  const itemClass =
    activeTab === name
      ? "inline-flex p-4 border-b-2 border-transparent rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group"
      : "inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group";

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
