<script lang="ts">
import { pausePlayer, player, resumePlayer } from '@/stores/player';
import { PauseSharp, PlaySharp } from 'svelte-ionicons';

export let missionNumber = 1;

let dateInput: HTMLInputElement;

$: {
  if (dateInput) {
    dateInput.valueAsDate = $player.date;
  }
}

function onDateChange(event: Event) {
  const newDate = (event.target as HTMLInputElement).valueAsDate;
  resumePlayer({ date: newDate });
}

function onSpeedActionClick() {
  const speeds = [0.5, 1, 2, 4, 8];
  const currentIndex = speeds.indexOf($player.speed);
  const nextSpeed = speeds[(currentIndex + 1) % speeds.length];

  resumePlayer({ speed: nextSpeed });
}

function onPlayPauseActionClick() {
  if ($player.isPlaying) {
    pausePlayer();
  } else {
    resumePlayer();
  }
}
</script>

<header>

  <div class="text">
    <div class="title">
      <h1 style="margin-right: auto">Voyager {missionNumber}</h1>

      <button
        data-tooltip="Speed"
        data-placement="bottom"
        on:click={onSpeedActionClick}
      >
        {$player.speed}x
      </button>

      <button
        data-tooltip="Play/Pause"
        data-placement="bottom"
        on:click={onPlayPauseActionClick}
      >
        {#if $player.isPlaying}
          <PauseSharp class="icon" />
        {:else}
          <PlaySharp class="icon" />
        {/if}
      </button>
    </div>

    <input
      type="date"
      min="1977-09-05"
      value="1977-09-05"
      bind:this={dateInput}
      on:focus={pausePlayer}
      on:blur={onDateChange}
    />
  </div>
</header>

<style lang="scss">
header {
  background-color: #343a40;

  display: flex;
  align-items: center;

  padding: 1rem;
  height: 100%;
}

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h1 {
      margin-bottom: 0;
      font-size: 1.5rem;

      display: flex;
      align-items: center;
    }

    button {
      padding: 0;
      margin: 0;
      margin-left: 1rem;
      width: fit-content;

      background: none;
      color: white;
      border: none;
      font-weight: bold;
      user-select: none;

      :global(.icon) {
        outline: none;
        fill: white;
        width: 1.25rem;
      }
    }
  }

  input {
    font-size: 0.9rem;

    padding: 0.25rem 0.75rem;
    margin: 0;
    height: 100%;
    width: 100%;
  }
}
</style>
