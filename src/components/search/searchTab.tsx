import { useSearchContext } from "../../context/searchContext";
import { LoadingSpinnerIcon, SearchIcon } from "../icons";
import SearchList from "./searchList";

function SearchTab() {
  const { handleSearchSubmit, setSearchPhrase, searchPhrase, searchLoading } =
    useSearchContext();

  return (
    <div>
      <form className="flex items-center" onSubmit={handleSearchSubmit}>
        <input
          className=" text-md leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-primary-500 focus:outline-none"
          type="text"
          value={searchPhrase}
          onChange={(event) => setSearchPhrase(event.target.value)}
        />
        <button
          type="submit"
          className="inline-block px-6 py-3 mb-0 ml-2 font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-gradient-to-tl from-primary-500 to-primary-700 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25"
        >
          {!searchLoading && <SearchIcon className={"h-4 w-4"} />}
          {searchLoading && (
            <LoadingSpinnerIcon
              className={
                "w-4 h-4 text-white-200 animate-spin dark:text-gray-600 fill-white"
              }
            />
          )}
        </button>
      </form>

      <div className="mt-4 p-1">
        <SearchList />
      </div>
    </div>
  );
}

export default SearchTab;
