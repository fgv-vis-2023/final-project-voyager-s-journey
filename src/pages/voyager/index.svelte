<script lang="ts">
import Gallery from '@/components/gallery';
import MissionHeader from '@/components/mission-header';
import SolarSystem from '@/components/solar-system';
import Timeline from '@/components/timeline';
import { pausePlayer, resetPlayer } from '@/stores/player';
import { onDestroy, onMount } from 'svelte';

export let missionNumber: 1 | 2 = 1;

onMount(() => {
  resetPlayer(missionNumber);
});

onDestroy(() => {
  pausePlayer();
});
</script>

<main>
  <MissionHeader {missionNumber} />
  <Timeline {missionNumber} />
  <Gallery {missionNumber} />
  <SolarSystem {missionNumber} />
</main>

<style lang="scss">
main {
  height: 100vh;

  display: grid;
  grid-template-columns: 20rem 1fr;
  grid-template-rows: 7rem 1fr;
}
</style>
