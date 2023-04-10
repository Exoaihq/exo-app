import { SearchListItemProps } from "../components/search/searchListItem";

export interface CreateSearchRequest {
  baseApiUrl: string;
  session: any;
  sessionId: string;
  searchPhrase: string;
}

export interface SearchResponseData {
  data: SearchListItemProps[];
}

export function searchCode(
  req: CreateSearchRequest
): Promise<SearchListItemProps[]> {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + "/search",
    body: JSON.stringify({
      search: req.searchPhrase,
      sessionId: req.sessionId,
    }),
  };

  return fetch(request.url, request)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res: SearchResponseData) => {
      const { data } = res;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}
