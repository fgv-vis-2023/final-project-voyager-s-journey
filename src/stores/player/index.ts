import { writable } from 'svelte/store';

export interface PlayerStore {
  isPlaying: boolean;
  time: number;
  speed: number;
}

export const player = writable<PlayerStore>({
  isPlaying: true,
  time: new Date('1977-09-10').getTime(),
  speed: 1,
});

let interval: number = null;

player.subscribe((value) => {
  if (value.isPlaying) {
    if (interval) return;

    interval = setInterval(() => {
      player.update((oldPlayer) => ({
        ...oldPlayer,
        time: oldPlayer.time + 5000000 * oldPlayer.speed,
      }));
    }, 20);
  } else {
    clearInterval(interval);
    interval = null;
  }
});

export function resumePlayer(args?: Exclude<Partial<PlayerStore>, 'isPlaying'>) {
  player.update((oldPlayer) => ({
    isPlaying: true,
    time: args?.time ?? oldPlayer.time,
    speed: args?.speed ?? oldPlayer.speed,
  }));
}

export function pausePlayer() {
  player.update((oldPlayer) => ({
    ...oldPlayer,
    isPlaying: false,
  }));
}
