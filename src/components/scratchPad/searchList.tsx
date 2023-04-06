// tsx
import { useCodeCompletionContext } from "../../context";
import SearchListItem from "../searchList/searchListItem";

function SearchList() {
  const { searchResults } = useCodeCompletionContext();

  return (
    <div>
      {searchResults &&
        searchResults.map((item, index) => {
          return (
            <div key={index}>
              <SearchListItem {...item} />
            </div>
          );
        })}
    </div>
  );
}

export default SearchList;
