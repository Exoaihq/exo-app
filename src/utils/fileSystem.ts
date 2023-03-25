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
