<script lang="ts">
import { pausePlayer, player, resumePlayer } from '@/stores/player';
import { imask } from '@imask/svelte';
import type { AnyMaskedOptions } from 'imask';
import IMask from 'imask';
import { PauseSharp, PlaySharp } from 'svelte-ionicons';

let tPlusInput: HTMLInputElement | null = null;

const mask: AnyMaskedOptions = {
  mask: 'd:h:m:s',

  lazy: false,

  blocks: {
    d: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 99999,
      maxLength: 3,
    },
    h: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 23,
      maxLength: 2,
    },
    m: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 59,
      maxLength: 2,
    },
    s: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 59,
      maxLength: 2,
    },
  },
};

$: {
  const startTime = new Date(1977, 8, 5, 12, 0, 0, 0).getTime();
  const tPlus = $player.time - startTime;

  const d = Math.floor(tPlus / (1000 * 60 * 60 * 24)) || 0;
  const h = Math.floor((tPlus % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) || 0;
  const m = Math.floor((tPlus % (1000 * 60 * 60)) / (1000 * 60)) || 0;
  const s = Math.floor((tPlus % (1000 * 60)) / 1000) || 0;

  const dStr = d.toString().padStart(5, '0');
  const hStr = h.toString().padStart(2, '0');
  const mStr = m.toString().padStart(2, '0');
  const sStr = s.toString().padStart(2, '0');

  if (tPlusInput) {
    tPlusInput.value = `${dStr}:${hStr}:${mStr}:${sStr}`;
  }
}

function onTPlusChange(event: Event) {
  console.log('onTPlusChange', event);

  const [d, h, m, s] = (event.target as HTMLInputElement).value.split(':');
  const startTime = new Date(1977, 8, 5, 12, 0, 0, 0).getTime();
  const newTime =
    startTime +
    +d * 1000 * 60 * 60 * 24 +
    +h * 1000 * 60 * 60 +
    +m * 1000 * 60 +
    +s * 1000;

  resumePlayer({ time: newTime });
}

function onSpeedActionClick() {
  const speeds = [0.5, 1, 2, 4, 8, 80];
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
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Voyager_Golden_Record_fx.png/1022px-Voyager_Golden_Record_fx.png"
    alt="Voyager Golden Record"
  />

  <div class="text">
    <div class="title">
      <h1 style="margin-right: auto">Voyager I</h1>

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

    <div class="time-field">
      <label for="T+" data-tooltip="T+ ddddd:hh:mm:ss" data-placement="bottom">
        T+
      </label>
      <input
        type="text"
        name="T+"
        value="00000:00:00:00"
        autocorrect="off"
        autocomplete="off"
        use:imask={mask}
        bind:this={tPlusInput}
        on:focus={pausePlayer}
        on:blur={onTPlusChange}
      />
    </div>
  </div>
</header>

<style lang="scss">
header {
  background-color: #343a40;

  display: flex;
  align-items: center;

  padding: 1rem;
  height: 100%;
  width: 24rem;
}

img {
  height: 100%;
  margin-right: 1rem;
}

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;

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
      margin-left: 0.75rem;
      width: fit-content;

      background: none;
      color: white;
      border: none;
      font-weight: bold;
      user-select: none;

      :global(.icon) {
        outline: none;
        fill: white;
      }
    }
  }

  .time-field {
    display: flex;
    align-items: center;
    height: 2rem;
    font-size: 0.9rem;

    label {
      background-color: #495057;
      color: white;
      padding: 0 0.5rem;
      margin: 0;
      height: 100%;

      display: flex;
      align-items: center;
      border-bottom: none;
    }

    input {
      padding: 0 0.5rem;
      height: 100%;

      margin: 0;

      text-align: right;
    }
  }
}
</style>
