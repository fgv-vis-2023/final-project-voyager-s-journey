<script lang="ts">
import MissionHeader from '@/components/mission-header';
import Simulation from '@/components/simulation';
</script>

<main>
  <MissionHeader />
  <div />
  <aside />
  <Simulation />
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
