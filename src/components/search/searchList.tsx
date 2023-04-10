// tsx
import { useSearchContext } from "../../context/searchContext";
import SearchListItem from "./searchListItem";

function SearchList() {
  const { searchResults } = useSearchContext();

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
