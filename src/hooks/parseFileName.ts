export function extractFileNameAndPathFromFullPath(path: string): {
  fileName: string;
  extractedPath: string;
} {
  const fileName = path.split("/");
  const extractedPath = fileName.slice(0, fileName.length - 1).join("/");
  return { fileName: fileName[fileName.length - 1], extractedPath };
}
