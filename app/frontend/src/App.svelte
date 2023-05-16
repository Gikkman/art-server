<script lang="ts">
  import {type CardImage} from "../../types/CardTypes"
  import CardGrid from "./CardGrid.svelte";
  import SearchBar from "./SearchBar.svelte";

  let cards: CardImage[] = [];
</script>

<SearchBar bind:cards />

<CardGrid bind:cards/>
