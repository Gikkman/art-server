<script lang="ts">
  import AutoComplete from "simple-svelte-autocomplete"
  import {type CardImage} from "../../types/CardTypes"
  import { localQueryFilter, remoteQuery, type QueryResult, apiCardSearch } from "./search-api";

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
    cards = await apiCardSearch(item);
    return cards;
  }

</script>

<AutoComplete
  delay="250"
  searchFunction={query}

  localSorting={true}
  localFiltering={false}
  cleanUserText={false}

  minCharactersToSearch=3
  maxItemsToShowInList=14

  labelFieldName="name"
  valueFieldName="name"
  placeholder="Search an MtG card name"

  dropdownClassName=dropdown

  onChange={onChange}
/>

