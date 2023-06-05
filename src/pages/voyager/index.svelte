<script lang="ts">
import Gallery from '@/components/gallery';
import MissionHeader from '@/components/mission-header';
import SolarSystem from '@/components/solar-system';
import Timeline from '@/components/timeline';
import { pausePlayer, resumePlayer } from '@/stores/player';
import dayjs from 'dayjs';
import { onDestroy, onMount } from 'svelte';

export let missionNumber = 1;

onMount(() => {
  const initialDay = missionNumber == 1 ? '1977-09-05' : '1977-08-25';

  resumePlayer({ date: dayjs(initialDay).toDate() });
  pausePlayer();
});

onDestroy(() => {
  pausePlayer();
});
</script>

<main>
  <MissionHeader {missionNumber} />
  <Timeline {missionNumber} />
  <Gallery {missionNumber}/>
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
