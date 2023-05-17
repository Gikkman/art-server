<script lang="ts">
  import AutoComplete from "simple-svelte-autocomplete"
  import {type CardImage} from "../../types/CardTypes"

  // Communications channel
  export let cards: CardImage[];
   
  let previousQueryKeyword: string = "";
  let previousQueryResult: {name:string}[] = [];
  let previousChosenCard: {name:string} = {name:""};

  async function query(keyword: string) {
    console.log(keyword)
    if(!keyword) return [];

    // Local search cached results if the user just types more
    // Note that "keyword" is cast to lower case by the AutoComplete component
    if(previousQueryResult.length > 0 && keyword.startsWith(previousQueryKeyword)) {
      const newResult: {name:string}[] = [];
      for(let i = 0; i < previousQueryResult.length; i++) {
        const word = previousQueryResult[i].name.toLowerCase();
        if(word.startsWith(keyword)) {
          newResult.push(previousQueryResult[i])
        }
      }
      previousQueryKeyword = keyword;
      previousQueryResult = newResult;
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
        previousQueryResult = data.names;
        previousQueryKeyword = keyword;
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
    previousQueryKeyword = item.name.toLowerCase();
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
  cleanUserText={false}
  minCharactersToSearch=3
  maxItemsToShowInList=20
  labelFieldName="name"
  valueFieldName="name"
  placeholder="Search an MtG card name"
  
  onChange={onChange}
/>
