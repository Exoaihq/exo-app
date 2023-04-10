/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { searchCode } from "../api/search";
import { SearchListItemProps } from "../components/search/searchListItem";
import { useSessionContext } from "./sessionContext";

export const SearchContextWrapper = (props: any) => {
  const [searchResults, setSearchResults] = useState<SearchListItemProps[]>([]);
  const { session, baseApiUrl, sessionId } = useSessionContext();

  const [searchPhrase, setSearchPhrase] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const useCreateSearchMutation = useMutation(searchCode, {
    onSuccess: async (res) => {
      setSearchResults(res);
    },
    onError(error: Error) {
      console.log(error);
    },
    onSettled: () => {
      setSearchLoading(false);
    },
  });

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchLoading(true);
    useCreateSearchMutation.mutate({
      searchPhrase,
      session,
      sessionId,
      baseApiUrl,
    });
    console.log(searchPhrase);
  }

  const value = {
    searchResults,
    setSearchResults,
    setSearchPhrase,
    handleSearchSubmit,
    searchPhrase,
    searchLoading,
  };

  return (
    <SearchContext.Provider value={value}>
      {props.children}
    </SearchContext.Provider>
  );
};

export const SearchContext = createContext({
  searchResults: [] as SearchListItemProps[],
  setSearchResults: (searchResults: SearchListItemProps[]) => {},
  setSearchPhrase: (searchPhrase: string) => {},
  handleSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => {},
  searchPhrase: "",
  searchLoading: false,
});

export const useSearchContext = () => useContext(SearchContext);
