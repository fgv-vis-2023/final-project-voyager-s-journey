<script lang="ts">
import MissionHeader from '@/components/mission-header';
import SolarSystem from '@/components/solar-system';
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
  <div />
  <aside />
  <SolarSystem {missionNumber} />
</main>

<style lang="scss">
main {
  height: 100vh;

  display: grid;
  grid-template-columns: 24rem 1fr;
  grid-template-rows: 6.5rem 1fr;
}

aside {
  background-color: #282d31;
}
</style>
