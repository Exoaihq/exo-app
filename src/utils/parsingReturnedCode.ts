export type CodeOrMessage = "code" | "message";

function addCommentPrefix(input: string): string {
  // Define the words to be prefixed
  const wordsToPrefix = [
    "html",
    "tsx",
    "jsx",
    "ts",
    "js",
    "typescript",
    "javascript",
  ];

  // Split the input string by spaces
  const inputWords = input.split(" ");

  // Map the inputWords array, adding the prefix to the matching words
  const prefixedWords = inputWords.map((word) => {
    if (wordsToPrefix.includes(word)) {
      return `//${word}`;
    }
    return word;
  });

  // Combine the prefixedWords array back into a single string
  const output = prefixedWords.join(" ");

  return output;
}

export const parseReturnedCode = (
  content: string,
  codeOrMessage: CodeOrMessage
): string => {
  const getCode = codeOrMessage === "code";

  if (content.includes("```")) {
    const code = content.split("```");
    getCode ? code[1] : code[0];
  } else if (content.includes("'''")) {
    const code = content.split("'''");
    return getCode ? code[1] : code[0];
  }

  return content;
};

export function textIncludeScratchPad(text: string) {
  return text.toLowerCase().includes("scratch");
}
