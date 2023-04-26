import { ApiRoutes } from ".";

export interface CreateDirectoryRequest {
  directory: string;
  baseApiUrl: string;
  session: any;
  sessionId: string;
}

export interface UpdateDirectoryRequest {
  directoryId: string;
  values: Partial<GetDirectoriesResponseObject>;
  baseApiUrl: string;
  session: any;
  sessionId: string;
}

export interface GetDirectoriesRequest {
  baseApiUrl: string;
  session: any;
  sessionId: string;
}

export interface GetDirectoriesResponseObject {
  saved: boolean;
  id: string;
  file_path: string;
  directory_name: string;
  indexed_at: string;
  directory_explaination?: string;
  is_root_directory: boolean;
}

export interface DirectoryFileCount {
  name: string;
  fileCount: number;
}

export interface DirectoryMetadata {
  directoryCount: number;
  savedDirectoryCount: number;
  directoryFileCount: DirectoryFileCount[];
}

export interface GetDirectoriesResponse {
  data: GetDirectoriesResponseObject[];
  metadata: DirectoryMetadata;
}

export function getDirectories(
  req: GetDirectoriesRequest
): Promise<GetDirectoriesResponse> {
  const request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + ApiRoutes.CODE_DIRECTORY,
  };

  return fetch(request.url, request)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res: GetDirectoriesResponse) => {
      return res;
    })
    .catch((err) => {
      throw new Error(err);
    });
}

export function createDirectory(
  req: CreateDirectoryRequest
): Promise<GetDirectoriesResponseObject[]> {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + "/code-directory",
    body: JSON.stringify({
      directory: req.directory,
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
    .then((res: GetDirectoriesResponse) => {
      const { data } = res;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}

export function updateDirectoryToAddFileTo(
  req: CreateDirectoryRequest
): Promise<GetDirectoriesResponseObject[]> {
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + "/code-directory/add-file",
    body: JSON.stringify({
      directory: req.directory,
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
    .then((res: GetDirectoriesResponse) => {
      const { data } = res;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}

export function updateDirectory(
  req: UpdateDirectoryRequest
): Promise<GetDirectoriesResponseObject[]> {
  const request = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      access_token: req.session?.access_token,
      refresh_token: req.session?.refresh_token,
      session_id: req.sessionId,
    },
    url: req.baseApiUrl + "/code-directory",
    body: JSON.stringify({
      directoryId: req.directoryId,
      sessionId: req.sessionId,
      values: req.values,
    }),
  };

  return fetch(request.url, request)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res: GetDirectoriesResponse) => {
      const { data } = res;
      return data;
    })
    .catch((err) => {
      throw new Error(err);
    });
}
