const fs = require("fs");
const path = require("path");

export function getFileContent(filePath: string) {
  const content = fs.readFileSync(filePath, "utf8");
  return content;
}

export function createFile(fileName: string, text: string, folder = "./src") {
  const location = path.join(folder, fileName);
  fs.writeFile(location, text, (err: any) => {
    if (err) throw err;
    console.log(`${location} has been created and populated with text.`);
  });
}

export async function overwriteFile(filePath: string, code: string) {
  await fs.writeFile(filePath, code, (err: any) => err && console.log(err));
}

const parentDirectory = (source: string) => path.dirname(source);

export const getRootParentDirectory = (source: string): any => {
  const currentParent = parentDirectory(source);

  if (currentParent === "/") {
    return source;
  } else {
    return getRootParentDirectory(currentParent);
  }
};

export const getChildDirectories = (source: string) => {
  return fs
    .readdirSync(source)
    .map((name: string) => path.join(source, name))
    .filter((source: string) => fs.lstatSync(source).isDirectory());
};

export const findNamedDirectory = (
  children: string[],
  selectedDirectory: string
): {
  found: string | null;
  childrenDirectories: string[];
} => {
  try {
    const childrenDirectories: string[] = [];

    for (let i = 0; i < children.length; i++) {
      if (
        children &&
        children[i] &&
        (children[i].includes(".Trash") ||
          children[i].includes(".git") ||
          children[i].includes(".vscode") ||
          children[i].includes("node_modules") ||
          children[i].includes("dist") ||
          children[i].includes("build") ||
          children[i].includes("out") ||
          children[i].includes("target") ||
          children[i].includes("bin") ||
          children[i].includes("obj") ||
          children[i].includes("cache") ||
          children[i].includes("logs") ||
          children[i].includes("Downloads") ||
          children[i].includes("Accounts") ||
          children[i].includes("Library"))
      ) {
        continue;
      } else if (children[i].includes(selectedDirectory)) {
        return { found: children[i], childrenDirectories: [] };
      } else {
        childrenDirectories.push(getChildDirectories(children[i]));
      }
    }
    return {
      found: null,
      childrenDirectories: childrenDirectories.flat(),
    };
  } catch (err) {
    console.log(err);
  }
};

export const foundDirectory = (parentDirectory: string, response: string) => {
  const children = getChildDirectories(parentDirectory);

  const directoriesToSearch = children;
  const found = false;

  while (!found && directoriesToSearch.length > 0) {
    const res = findNamedDirectory(directoriesToSearch, response);
    if (res && res.found) {
      return found;
    } else if (res) {
      directoriesToSearch.push(res.childrenDirectories);
    }
  }
};
