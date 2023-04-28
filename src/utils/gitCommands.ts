import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";

export async function getGitDiff(baseDirectory: string) {
  const options: Partial<SimpleGitOptions> = {
    baseDir: baseDirectory,
    binary: "git",
    maxConcurrentProcesses: 6,
    trimmed: false,
  };

  const git: SimpleGit = simpleGit(options);

  //   const gitDiffOptions = ["--word-diff", "--unified=0"];
  const gitDiffOptions = ["--name-only"];

  const diff = await git.diff(gitDiffOptions);

  const status = await git.status();
  const untrackedFiles = status.not_added.map(
    (file) => `${baseDirectory}/${file}`
  );

  return {
    files: diff,
    untrackedFiles,
  };
}
