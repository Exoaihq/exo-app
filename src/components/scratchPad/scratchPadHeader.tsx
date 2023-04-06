import { useScratchPadContext } from "../../context/scratchPadContext";
import { useSessionContext } from "../../context/sessionContext";
import { ChatBubble } from "../icons";
import ScratchPadHeaderItem from "./scratchPadHeaderItem";
import { menuItems } from "./scratchPadHeaderItems";

function ScratchPadHeader() {
  const { handleLogout } = useSessionContext();
  const { activeTab, setActiveTab } = useScratchPadContext();

  return (
    <div className=" dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        <div className="md:hidden">
          <ScratchPadHeaderItem
            name="Chat"
            icon={
              <ChatBubble
                className={
                  activeTab === "Chat"
                    ? "w-5 h-5 mr-2 text-primary-700 dark:text-primary-700"
                    : "w-5 h-5 mr-2 text-gray-400 group-hover:text-primary-700 dark:text-gray-500 dark:group-hover:text-primary-700"
                }
              />
            }
            setActiveTab={setActiveTab}
          />
        </div>
        {menuItems(activeTab).map((item, index) => {
          return (
            <ScratchPadHeaderItem
              key={index}
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
            className="inline-flex p-4 border-b-2 border-transparent rounded-t-lg dark:hover:text-primary-700 group"
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}

export default ScratchPadHeader;
