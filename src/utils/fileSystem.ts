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
    .readdir(source)
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

export const getChildDirectoriesAsync = async (source: string) => {
  return await fs.promises.readdir(source);
};

const foldersToExclude = [
  "node_modules",
  "dist",
  ".vscode",
  ".git",
  "yarn.lock",
  ".DS_Store",
  "code-gen-app-darwin-x64",
  "exo-app-darwin-x64",
  "make",
  ".webpack",
  "build",
  "out",
  "target",
  "bin",
  "obj",
  "cache",
  "logs",
  "Downloads",
  "Accounts",
];

const filesToExcule = [
  "yarn.lock",
  ".json",
  "supabase.ts",
  "yarn-error.log",
  ".eslintrc.json",
  ".git",
  ".gitignore",
  ".DS_Store",
  "package-lock.json",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".ico",
  ".pdf",
];

function doesPathContainFolderToExclude(path: string): boolean {
  return foldersToExclude.some((folder) => path.includes(folder));
}

function doesPathContainFileToExclude(path: string): boolean {
  return filesToExcule.some((file) => path.includes(file));
}

export interface FilePathAndContent {
  filePath: string;
  contents: string;
}

async function dirIt(
  directory: string,
  files: FilePathAndContent[],
  dirs: string[]
) {
  try {
    const dirContent = fs.readdirSync(directory);
    console.log(dirContent);

    dirContent.forEach((path: string) => {
      const fullPath = `${directory}/${path}`;

      if (fs.statSync(fullPath).isFile()) {
        if (doesPathContainFileToExclude(path)) {
          console.log("Skipping >>>>>>>>>>>>>>>>>>", path);
        } else {
          const contents = fs.readFileSync(fullPath, "utf8");
          files.push({
            filePath: fullPath,
            contents,
          });
        }
      } else {
        if (doesPathContainFolderToExclude(path)) {
          // console.log("Skipping >>>>>>>>>>>>>>>>>>", filePath);
        } else {
          dirs.push(fullPath);
        }
      }
    });

    if (dirs.length !== 0) dirIt(dirs.pop(), files, dirs);

    return files;
  } catch (ex) {
    console.log(ex);
    return false;
  }
}

export const iterateDir = async (directory: string) => {
  const files: FilePathAndContent[] = [];
  const dirs: string[] = [];

  const res = await dirIt(directory, files, dirs);

  console.log(res.length, files.length, dirs.length);
  return res;
};
