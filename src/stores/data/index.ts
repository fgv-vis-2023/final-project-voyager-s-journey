import { basePath } from '@/env';
import * as d3 from 'd3';
import { writable } from 'svelte/store';

type VoyagerDailyPosition = d3.DSVRowArray<
  'date' | 'range' | 'se_lat' | 'se_lon' | 'hg_lat' | 'hg_lon' | 'ihg_lon'
>;

type VoyagerImages = d3.DSVRowArray<
  'title' | 'caption' | 'image_url' | 'page_url' | 'date'
>;

interface DataStore {
  isLoaded: boolean;
  voyagerDailyPosition: Record<1 | 2, VoyagerDailyPosition>;
  voyagerImages: Record<1 | 2, VoyagerImages>;
}

export const data = writable<DataStore>({
  isLoaded: false,
  voyagerDailyPosition: {} as any,
  voyagerImages: {} as any,
});

export const loadData = async () => {
  const dataPth = `${basePath}/data`;

  const [
    voyager1DailyPosition,
    voyager2DailyPosition,
    voyager1Images,
    voyager2Images,
  ] = (await Promise.all([
    d3.csv(`${dataPth}/voyager1-daily-position.csv`),
    d3.csv(`${dataPth}/voyager2-daily-position.csv`),
    d3.csv(`${dataPth}/voyager1-images.csv`),
    d3.csv(`${dataPth}/voyager2-images.csv`),
  ])) as [
    VoyagerDailyPosition,
    VoyagerDailyPosition,
    VoyagerImages,
    VoyagerImages
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
  });
};
