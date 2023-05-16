<script lang="ts">
  import AutoComplete from "simple-svelte-autocomplete"
  import {type CardImage} from "../../types/CardTypes"

  // Communications channel
  export let cards: CardImage[];
   
  let previousSearchWordLower: string = "";
  let previousSearchResult: {name:string}[] = [];
  let previousChosenCard: {name:string} = {name:""};

  async function query(keyword: string) {
    if(!keyword) return [];

    // Local search cached results if the user just types more
    const keywordLower = keyword.toLowerCase();
    if(previousSearchResult.length > 0 && keywordLower.startsWith(previousSearchWordLower)) {
      const newResult: {name:string}[] = [];
      for(let i = 0; i < previousSearchResult.length; i++) {
        const word = previousSearchResult[i].name.toLowerCase();
        if(word.startsWith(keywordLower)) {
          newResult.push(previousSearchResult[i])
        }
      }
      previousSearchWordLower = keywordLower;
      previousSearchResult = newResult;
      return newResult;
    }

    // Fetch from the server if it is a new search
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 5_000);
    try {
      const response = await fetch(`/query?name=${keyword}`, {signal: controller.signal})
      if(response.status >= 200 && response.status < 300) {
        const data = await response.json();
        previousSearchResult = data.names;
        previousSearchWordLower = keywordLower;
        return data.names;
      }
    } catch (ex) {
      console.error(ex)
    }

    return [];
  }

  async function onChange(item: {name: string}) {
    if(!item || !item.name || item.name === previousChosenCard.name) return;
    previousChosenCard = item;
    previousSearchWordLower = item.name.toLowerCase();
    const response = await fetch(`/search?name=${item.name}`)
    if(response.status >= 200 && response.status < 300) {
      const data = await response.json();
      return cards = data;
    }
  }

</script>

<!-- Search input field -->
<AutoComplete
  searchFunction={query}
  delay="200"
  localSorting={true}
  minCharactersToSearch=3
  maxItemsToShowInList=20
  labelFieldName="name"
  valueFieldName="name"
  placeholder="Search an MtG card name"
  onChange={onChange}
/>
