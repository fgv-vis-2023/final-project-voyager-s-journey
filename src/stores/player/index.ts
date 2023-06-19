import dayjs from 'dayjs';
import { writable } from 'svelte/store';

const voyagerInitialDate = {
  1: dayjs('1977-09-09').toDate(),
  2: dayjs('1977-08-25').toDate(),
} as const;

interface PlayerStore {
  isPlaying: boolean;
  date: Date;
  speed: number;
}

export const player = writable<PlayerStore>({
  isPlaying: true,
  date: voyagerInitialDate[1],
  speed: 1,
});

let interval: number = null;

player.subscribe((value) => {
  if (value.isPlaying) {
    if (interval) return;

    interval = setInterval(() => {
      player.update((oldPlayer) => ({
        ...oldPlayer,
        date: dayjs(oldPlayer.date)
          .add(2 * oldPlayer.speed, 'day')
          .toDate(),
      }));
    }, 35);
  } else {
    clearInterval(interval);
    interval = null;
  }
});

export function resetPlayer(missionNumber: 1 | 2) {
  player.set({
    isPlaying: false,
    date: voyagerInitialDate[missionNumber],
    speed: 1,
  });
}

export function resumePlayer(args?: Partial<PlayerStore>) {
  player.update((oldPlayer) => ({
    isPlaying: true,
    date: args?.date ?? oldPlayer.date,
    speed: args?.speed ?? oldPlayer.speed,
  }));
}

export function pausePlayer() {
  player.update((oldPlayer) => ({
    ...oldPlayer,
    isPlaying: false,
  }));
}

export function togglePlayer() {
  player.update((oldPlayer) => ({
    ...oldPlayer,
    isPlaying: !oldPlayer.isPlaying,
  }));
}

window.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement) return;
  if (event.code === 'Space') togglePlayer();
});
