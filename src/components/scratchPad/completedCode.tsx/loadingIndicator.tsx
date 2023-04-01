import { LoadingSpinnerIcon } from "../../../components/icons";

function LoadingIndicator() {
  return (
    <div className="flex items-center">
      <div role="status">
        <LoadingSpinnerIcon
          className={
            "w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          }
        />
        <span className="sr-only">Loading...</span>
      </div>
      Running your command
    </div>
  );
}

export default LoadingIndicator;
