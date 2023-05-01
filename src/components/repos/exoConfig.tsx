import { useExoConfigContext } from "../../context/exoConfigContext";
import Divider from "../divider";
import { EditIcon } from "../icons";
import { GarbageCanIcon } from "../icons/GarbageCan";
import LoadingIndicator from "../scratchPad/completedCode.tsx/loadingIndicator";

function ExoConfig() {
  const {
    directoryName,
    explanation,
    codeStandards,
    setUpdatedExplanation,
    setEditExplanation,
    editExplanation,
    updatedExplanation,
    handleSaveExplanation,
    editCodeStandards,
    handleSaveCodeStandards,
    setEditCodeStandards,
    updatedCodeStandards,
    handleUpdateCodeStandards,
    loading,
    handleRemoveStandard,
    addCodeStandard,
  } = useExoConfigContext();

  return (
    <div className="p-4 relative">
      <p>Directory Name: {directoryName}</p>
      <Divider />
      <div className="flex flex-row ">
        <p className="grow">Explanation:</p>

        <EditIcon
          className="w-5 h-5 mr-2 text-primary-700 dark:text-primary-700 hover:text-primary-500"
          onClick={() => setEditExplanation(!editExplanation)}
        />
      </div>

      {editExplanation && !loading ? (
        <>
          <textarea
            className="text-md leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-primary-500 focus:outline-none"
            rows={4}
            value={updatedExplanation}
            onChange={(event) => setUpdatedExplanation(event.target.value)}
          />

          <button
            className="px-3 mt-2 rounded-lg border border-gray-300 hover:bg-gray-100"
            onClick={handleSaveExplanation}
          >
            Save
          </button>
        </>
      ) : (
        <>{!loading ? <p>{explanation}</p> : <LoadingIndicator />}</>
      )}
      <Divider />
      <div className="flex flex-row align-middle">
        <p className="grow">Code Standards:</p>
        {editCodeStandards && (
          <div className="flex flex-col gap-1">
            <button
              className="px-3 mr-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              onClick={handleSaveCodeStandards}
            >
              Save
            </button>
            <button
              className="px-3 mr-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              onClick={addCodeStandard}
            >
              {" "}
              Add
            </button>
          </div>
        )}

        <EditIcon
          className="w-5 h-5 mr-2 text-primary-700 dark:text-primary-700 hover:text-primary-500"
          onClick={() => setEditCodeStandards(!editCodeStandards)}
        />
      </div>
      {updatedCodeStandards?.length &&
        updatedCodeStandards?.map((codeStandard: string, index: any) => {
          return editCodeStandards && !loading ? (
            <div className="relative">
              <GarbageCanIcon
                className="w-3 h-3 absolute top-1 right-1"
                onClick={() => handleRemoveStandard(index)}
              />
              <textarea
                key={index}
                className="text-md m-1 leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-primary-500 focus:outline-none"
                rows={4}
                value={updatedCodeStandards[index]}
                onChange={(event) =>
                  handleUpdateCodeStandards(index, event.target.value)
                }
              />
            </div>
          ) : (
            <>
              {!loading ? (
                <p key={index}>{codeStandard ? codeStandard : ""}</p>
              ) : (
                <LoadingIndicator />
              )}
            </>
          );
        })}
      {codeStandards.length > 5 && editCodeStandards && (
        <button
          className="px-3 mt-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          onClick={handleSaveCodeStandards}
        >
          Save
        </button>
      )}
    </div>
  );
}

export default ExoConfig;
