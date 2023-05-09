<script lang="ts">
  import type { Card } from "./types";
  import CardGrid from "./CardGrid.svelte";
  import SearchBar from "./SearchBar.svelte";

  let cards: Card[] = [];
  let selectedCard: Card | null = null;
  let cardDetailsVisible = false;

  async function onCardClick(card: Card): Promise<void> {
    selectedCard = card;
    cardDetailsVisible = true;

    console.log(card);
  }
</script>

<SearchBar bind:cards />

<CardGrid bind:cards {onCardClick} {selectedCard} />
