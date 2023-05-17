<script lang="ts">
  import AutoComplete from "simple-svelte-autocomplete"
  import {type CardImage} from "../../types/CardTypes"
  import { localQueryFilter, remoteQuery, type QueryResult } from "./search-api";

  // Communications channel
  export let cards: CardImage[];
  
  
  let previousQueryKeyword: string = "";
  let previousQueryResult: QueryResult[] = [];
  let previousChosenCard: QueryResult = {name:""};

  async function query(keyword: string) {
    if(!keyword) return [];
    keyword = keyword.toLowerCase();

    // Search cached results if the user just types more
    if(previousQueryResult.length > 0 && keyword.startsWith(previousQueryKeyword)) {
      const newResult = localQueryFilter(keyword, previousQueryResult);
      previousQueryKeyword = keyword;
      previousQueryResult = newResult; 
      return newResult;
    }

    const newResult = await remoteQuery(keyword);
    previousQueryResult = newResult;
    previousQueryKeyword = keyword;
    return newResult;
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

<AutoComplete
  searchFunction={query}

  delay="200"
  localSorting={true}
  localFiltering={false}
  cleanUserText={false}
  minCharactersToSearch=3
  maxItemsToShowInList=14
  labelFieldName="name"
  valueFieldName="name"
  placeholder="Search an MtG card name"

  onChange={onChange}
/>
