export type QueryResult = { name: string };

export function localQueryFilter(keyword: string, alternatives: QueryResult[]) {
  const keywords = keyword.split(/\s+/);
  const newResult: QueryResult[] = [];

  /* This code is pretty messy, but in short, we search through the alternatives
   * and try to match our keyword(s) in order toward an alternative.
   *
   * Take "bo li" as the keyword. We split the keyword on space, and then search
   * alternatives for a word that has each keyword in-order. So "BOlas sLInger"
   * would match, because each keyword is found, and in order. But "LImited BOmbs"
   * would not, since they are out of order. Neither "aBOLIsh" would match, because
   * the two keywords needs to be at least 1 character apart. So "aBOsLIve" would
   * match.
   */
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
