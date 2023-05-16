<script lang="ts">
  import { type CardImage } from "../../types/CardTypes";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let card: CardImage;

  let loaded = false;
  let image: HTMLImageElement;

  // Reactive declaration. If 'card' is changed, set 'loaded' to false
  $: card, (loaded = false);

  onMount(() => {
    image.onload = () => {
      loaded = true;
    };
  });
</script>

<div in:fade out:fade class="card">
  <img
    class="image"
    class:loaded
    alt="Loaded"
    bind:this={image}
    src={card.imageUrl}
  />
  <img class="placeholder" src="/placeholder.jpg" alt="Is Loading" />

  {#if card.hasOtherFace}
    <p in:fade out:fade class="name">{card.name}</p>
  {/if}
</div>

<style>
  .card {
    display: grid;
    border-radius: 10px;
  }

  .name {
    overflow: hidden;
    margin: auto;
  }
  /* 
    This isn't ideal but we have to manually fade the actual card image
    to avoid re-structuring of the DOM once the placeholder is hidden.
  */
  .image {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 10px;
    opacity: 0;
    transition: opacity 0.3s linear;
    -webkit-transition: opacity 0.3s linear;
    -moz-transition: opacity 0.3s linear;
    -o-transition: opacity 0.3s linear;
  }

  .loaded {
    opacity: 1;
    transition: opacity 0.3s linear;
    -webkit-transition: opacity 0.3s linear;
    -moz-transition: opacity 0.3s linear;
    -o-transition: opacity 0.3s linear;
  }

  .placeholder {
    border-radius: 10px;
  }
</style>
