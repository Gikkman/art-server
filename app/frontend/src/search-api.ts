export type QueryResult = { name: string };

export function localQueryFilter(keyword: string, alternatives: QueryResult[]) {
  const keywords = keyword.split(/\s+/);
  const newResult: QueryResult[] = [];
  for (let i = 0; i < alternatives.length; i++) {
    const word = alternatives[i].name.toLowerCase();
    const target = keywords.length;
    let counter = 0;
    let position = 0;
    for (const needle of keywords) {
      if (word.includes(needle, position)) {
        position = word.indexOf(needle) + needle.length + 1;
        counter++;
      }
    }
    if (counter === target) {
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
    const response = await fetch(`/query?name=${keyword}`, { signal: controller.signal });
    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      return data.names;
    }
  } catch (ex) {
    console.error(ex);
  }
  return [];
}
