<script lang="ts">
  import {type CardImage} from "../../types/CardTypes"
  import CardGrid from "./CardGrid.svelte";
  import SearchBar from "./SearchBar.svelte";

  let cards: CardImage[] = [];
  let selectedCard: CardImage | null = null;
  let cardDetailsVisible = false;

  async function onCardClick(card: CardImage): Promise<void> {
    selectedCard = card;
    cardDetailsVisible = true;

    console.log(card);
  }
</script>

<SearchBar bind:cards />

<CardGrid bind:cards {onCardClick} {selectedCard} />
