import { FourDots, DirectoryIcon } from "../icons";

export const menuItems = (activeTab: string) => [
  {
    name: "Scratch Pad",
    icon: (
      <FourDots
        className={
          activeTab === "Scratch Pad"
            ? "w-5 h-5 mr-2 text-blue-600 dark:text-blue-500"
            : "w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
        }
      />
    ),
  },
  {
    name: "Directories",
    icon: (
      <DirectoryIcon
        className={
          activeTab === "Directories"
            ? "w-5 h-5 mr-2 text-blue-600 dark:text-blue-500"
            : "w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
        }
      />
    ),
  },
];
