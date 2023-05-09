<script lang="ts">
  // Import the necessary dependencies
  import { onMount } from "svelte";
  import { searchCards } from "./api";
  import type { Card } from "./types";

  // Communications channel
  export let cards: Card[];

  let searchQuery = "";

  // Function to update the cards based on the search query
  async function updateCards() {
    if (!searchQuery) return;
    cards = await searchCards(searchQuery);
    console.log(cards);
  }

  // Function to handle when the search query changes
  function handleSearchQueryChange(event: Event) {
    searchQuery = (event.target as HTMLInputElement).value;
    updateCards();
  }

  // On mount, fetch the initial list of cards
  onMount(updateCards);
</script>

<!-- Search input field -->
<input
  type="text"
  placeholder="Search for a Magic the Gathering card"
  on:change={handleSearchQueryChange}
/>

<style>
  input {
    width: 90%;
  }
</style>
