import { LoadingSpinnerIcon } from "../../icons";

function LoadingIndicator() {
  return (
    <div className="flex items-center">
      <div role="status">
        <LoadingSpinnerIcon
          className={
            "w-5 h-5 mr-2 text-gray-100 animate-spin dark:text-gray-400 fill-primary-700"
          }
        />
        <span className="sr-only">Loading...</span>
      </div>
      Writing your code
    </div>
  );
}

export default LoadingIndicator;
