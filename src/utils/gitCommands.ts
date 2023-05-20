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

export interface CreatePullRequestOptions {
  baseDirectory: string;
  fromBranch: string;
  toBranch: string;
  title: string;
  description?: string;
}

export async function createPullRequest(
  branchOptions: CreatePullRequestOptions
): Promise<void> {
  const options: Partial<SimpleGitOptions> = {
    baseDir: branchOptions.baseDirectory,
    binary: "git",
    maxConcurrentProcesses: 6,
    trimmed: false,
  };
  const git: SimpleGit = simpleGit(options);

  await git.addConfig("auto-set-upstream", "true");

  await git.fetch();
  // Create a new branch for the changes
  await git.checkoutLocalBranch(branchOptions.fromBranch);

  // Make the changes to the code
  // ...

  // Commit the changes
  await git.add("./*");
  await git.commit("Commit message");

  // Push the changes to the forked repository
  await git.push(branchOptions.toBranch, branchOptions.fromBranch);
}
