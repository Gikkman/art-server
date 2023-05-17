export type QueryResult = { name: string };

export function localQueryFilter(keyword: string, alternatives: QueryResult[]): QueryResult[] {
  const newResult: QueryResult[] = [];

  for (let i = 0; i < alternatives.length; i++) {
    const word = alternatives[i].name.toLowerCase();
    if (word.includes(keyword)) {
      newResult.push(alternatives[i]);
    }
  }

  return newResult;
}

export async function remoteQuery(keyword: string) {
  // Fetch from the server if it is a new search
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort();
  }, 5_000);
  try {
    // Keep the space at the end of a string, if the user input a search word ending with a string
    // Otherwise, axios will trim trailing spaces
    const formattedKeyword = keyword.endsWith(" ") ? keyword.trim() + "%20" : keyword.trim();
    const response = await fetch(`/query?name=${formattedKeyword}`, { signal: controller.signal });
    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      return data.names;
    }
  } catch (ex) {
    console.error(ex);
  }
  return [];
}

export async function apiCardSearch(item: QueryResult) {
  const response = await fetch(`/search?name=${item.name}`);
  if (response.status >= 200 && response.status < 300) {
    return await response.json();
  }
}
