import {
  useDirectoryContext,
  useCodeCompletionContext,
  useAiCompletedCodeContext,
  useScratchPadContext,
} from "../../context";
import { GetAiCompletedCodeResponseObject } from "../../api";
import LoadingIndicator from "./completedCode.tsx/loadingIndicator";
import Divider from "../divider";
import CompletedCode from "./completedCode.tsx/completedCode";

function ScatchPadTab() {
  const { newFile, selectedFile, setSelectedFile } = useDirectoryContext();
  const { scratchPadLoading } = useCodeCompletionContext();
  const { data } = useAiCompletedCodeContext();
  const { activeTab } = useScratchPadContext();

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files[0];
    setSelectedFile(file);
  }

  return (
    <div>
      {true && !newFile && activeTab === "Scratch Pad" && (
        <div>
          {" "}
          <input type="file" onChange={handleFileSelect} />
          {selectedFile && (
            <div>
              <p>You have selected the file: {selectedFile.name}</p>
            </div>
          )}
        </div>
      )}
      {scratchPadLoading && (
        <div className="mt-8">
          <LoadingIndicator />
        </div>
      )}
      {data && data.length > 0 && <Divider />}
      {data &&
        data.length > 0 &&
        data.map((item: GetAiCompletedCodeResponseObject, index: any) => {
          return <CompletedCode key={index} data={item} />;
        })}
    </div>
  );
}

export default ScatchPadTab;
