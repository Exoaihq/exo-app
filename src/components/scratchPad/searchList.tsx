import { useCodeCompletionContext } from "../../context";
import CodeListItem from "../codeList/codeListItem";

function SearchList() {
  const { searchResults } = useCodeCompletionContext();

  return (
    <div>
      {searchResults &&
        searchResults.map((item, index) => {
          return (
            <div key={index}>
              <CodeListItem
                date={item.created_at}
                title={item.file_name}
                code={item.code_string}
                index={index}
                filePath={item.relative_file_path}
                fileName={item.file_name}
              />
            </div>
          );
        })}
    </div>
  );
}

export default SearchList;
