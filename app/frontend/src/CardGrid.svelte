<script lang="ts">
  import {type CardImage} from "../../types/CardTypes"
  
  export let cards: CardImage[];
  export let onCardClick: (card: CardImage) => void = () => {};
  export let selectedCard: CardImage | null = null;
</script>

<div class="card-grid">
  {#each cards as card}
    <div>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <img
        class="card-image active:{selectedCard === card}"
        src={card.imageUrl}
        alt={card.name}
        on:click={() => onCardClick(card)}
      />
      {#if card.hasOtherFace }
        <p>{card.name}</p>
      {/if}
    </div>
  {/each}
</div>

<style>
  p {
    overflow: hidden;
  }

  .card-grid {
    padding-top: 25px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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
