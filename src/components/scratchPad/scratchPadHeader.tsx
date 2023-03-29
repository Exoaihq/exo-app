import { useScratchPadContext } from "../../context/scratchPadContext";
import { useSessionContext } from "../../context/sessionContext";
import ScratchPadHeaderItem from "./scratchPadHeaderItem";
import { menuItems } from "./scratchPadHeaderItems";

function ScratchPadHeader() {
  const { handleLogout } = useSessionContext();
  const { activeTab, setActiveTab } = useScratchPadContext();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        {menuItems(activeTab).map((item, index) => {
          return (
            <ScratchPadHeaderItem
              key={index}
              activeTab={activeTab}
              name={item.name}
              icon={item.icon}
              setActiveTab={setActiveTab}
            />
          );
        })}
        <div className="grow max-sm:hidden"></div>
        <li className="mr-2" onClick={handleLogout}>
          <a
            href="#"
            className="inline-flex p-4 border-b-2 border-transparent rounded-t-lg dark:hover:text-gray-300 group"
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}

export default ScratchPadHeader;
