import { basePath } from '@/env';
import * as d3 from 'd3';
import { writable } from 'svelte/store';

type VoyagerDailyPosition = d3.DSVRowArray<
  'date' | 'range' | 'se_lat' | 'se_lon' | 'hg_lat' | 'hg_lon' | 'ihg_lon'
>;

type VoyagerImages = d3.DSVRowArray<
  'title' | 'caption' | 'image_url' | 'page_url' | 'date'
>;

type VoyagerPhases = d3.DSVRowArray<
  'name' | 'start_time' | 'end_time' | 'type'
>;

interface DataStore {
  isLoaded: boolean;
  voyagerDailyPosition: Record<1 | 2, VoyagerDailyPosition>;
  voyagerImages: Record<1 | 2, VoyagerImages>;
  voyagerPhases: Record<1 | 2, VoyagerPhases>;
}

export const data = writable<DataStore>({
  isLoaded: false,
  voyagerDailyPosition: {} as any,
  voyagerImages: {} as any,
  voyagerPhases: {} as any,
});

export const loadData = async () => {
  const dataPth = `${basePath}/data`;

  const [
    voyager1DailyPosition,
    voyager2DailyPosition,
    voyager1Images,
    voyager2Images,
    voyager1Phases,
    voyager2Phases,

  ] = (await Promise.all([
    d3.csv(`${dataPth}/voyager1-daily-position.csv`),
    d3.csv(`${dataPth}/voyager2-daily-position.csv`),
    d3.csv(`${dataPth}/voyager1-images.csv`),
    d3.csv(`${dataPth}/voyager2-images.csv`),
    d3.csv(`${dataPth}/voyager1-phases.csv`),
    d3.csv(`${dataPth}/voyager2-phases.csv`),
  ])) as [
    VoyagerDailyPosition,
    VoyagerDailyPosition,
    VoyagerImages,
    VoyagerImages,
    VoyagerPhases,
    VoyagerPhases,
  ];

  data.set({
    isLoaded: true,
    voyagerDailyPosition: {
      1: voyager1DailyPosition,
      2: voyager2DailyPosition,
    },
    voyagerImages: {
      1: voyager1Images,
      2: voyager2Images,
    },
    voyagerPhases: {
      1: voyager1Phases,
      2: voyager2Phases,
    },
  });
};
