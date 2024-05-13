<script lang="ts">
  import {type CardImage} from "../../types/CardTypes"
  import Card from "./Card.svelte"

  export let cards: CardImage[];
</script>

<div class="card-grid">
  {#each cards as card}
    <Card {card}></Card>
  {/each}
</div>
<img src="/placeholder.jpg" class="sneaky-preload" alt="Preloading placeholder">

<style>
  .card-grid {
    padding-top: 25px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1rem;
  }
  .sneaky-preload {
    visibility: hidden;
  }
</style>
