<script lang="ts">
  import { type Card } from "./types";

  export let cards: Card[];
  export let onCardClick: (card: Card) => void = () => {};
  export let selectedCard: Card | null = null;
</script>

<div class="card-grid">
  {#each cards as card}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img
      class="card-image active:{selectedCard === card}"
      src={card.imageUrl}
      alt={card.name}
      on:click={() => onCardClick(card)}
    />
  {/each}
</div>

<style>
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .card-image {
    width: 100%;
    height: auto;
    cursor: pointer;
    opacity: 0.8;
  }

  .active {
    opacity: 1;
  }
</style>
