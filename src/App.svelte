<script lang="ts">
import HomePage from '@/pages/home';
import VoyagerPage from '@/pages/voyager';
import { onMount } from 'svelte';
import { Route, Router } from 'svelte-routing';
import { data, loadData } from './stores/data';

export let url = '';

onMount(() => {
  loadData();
});
</script>

{#if !$data.isLoaded}
  <div class="loading-indicator">
    <p>Loading...</p>
    <progress />
  </div>
{:else}
  <Router {url}>
    <Route path="/"><HomePage /></Route>
    <Route path="/voyager/:missionNumber" let:params>
      <VoyagerPage missionNumber={+params.missionNumber} />
    </Route>
  </Router>
{/if}

<style lang="scss">
.loading-indicator {
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  background-color: rgba(0, 0, 0, 0.75);

  p {
    color: white;
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
  }

  progress {
    width: min(50%, 20rem);
  }
}
</style>
