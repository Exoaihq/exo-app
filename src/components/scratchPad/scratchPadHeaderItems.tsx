import { ActiveTab } from "../../context/scratchPadContext";
import { DirectoryIcon, PaperIcon } from "../icons";

export const menuItems = (activeTab: ActiveTab) => [
  {
    name: "Repos",
    icon: (
      <DirectoryIcon
        className={
          activeTab === "Repos"
            ? "w-5 h-5 mr-2 text-primary-700 dark:text-primary-700"
            : "w-5 h-5 mr-2 text-gray-400 group-hover:text-primary-700 dark:text-gray-500 dark:group-hover:text-primary-700"
        }
      />
    ),
  },
  {
    name: "Scratch Pad",
    icon: (
      <PaperIcon
        className={
          activeTab === "Scratch Pad"
            ? "w-5 h-5 mr-2 text-primary-700 dark:text-primary-700"
            : "w-5 h-5 mr-2 text-gray-400 group-hover:text-primary-700 dark:text-gray-500 dark:group-hover:text-primary-700"
        }
      />
    ),
  },
];
