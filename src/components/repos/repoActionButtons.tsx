import { useWriteTestContext } from "../../context/writeTestContext";
import IconActionButton from "../buttons/iconActionButton";
import { EditIcon, PlusIcon, UpArrowOnPaperIcon } from "../icons";

function RepoActionButtons({
  repo,
  handleAddNewFile,
  handleAddRepoOrFile,
  selectedFile,
}: {
  repo: string;
  handleAddNewFile: (repo: string) => void;
  handleAddRepoOrFile: () => void;
  selectedFile: any;
}) {
  const { handleWriteTests } = useWriteTestContext();

  return (
    <div className="flex flex-wrap gap-1">
      <IconActionButton
        disabled={repo === "" && !selectedFile}
        onClick={handleAddRepoOrFile}
      >
        <UpArrowOnPaperIcon className="w-4 h-4" />
        Save Repo
      </IconActionButton>

      <IconActionButton onClick={() => handleAddNewFile(repo)}>
        <PlusIcon className="w-4 h-4" /> Add new file
      </IconActionButton>

      <IconActionButton onClick={() => handleWriteTests(repo)}>
        <EditIcon className="w-4 h-4" /> Write tests
      </IconActionButton>
    </div>
  );
}

export default RepoActionButtons;
