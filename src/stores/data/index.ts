import * as d3 from 'd3';
import { writable } from 'svelte/store';

type VoyagerDailyPosition = d3.DSVRowArray<
  'date' | 'range' | 'se_lat' | 'se_lon' | 'hg_lat' | 'hg_lon' | 'ihg_lon'
>;

type VoyagerImages = d3.DSVRowArray<'title' | 'caption' | 'image_url' | 'date'>;

interface DataStore {
  isLoaded: boolean;
  voyager1DailyPosition?: VoyagerDailyPosition;
  voyager2DailyPosition?: VoyagerDailyPosition;
  voyager1Images?: VoyagerImages;
  voyager2Images?: VoyagerImages;
}

export const data = writable<DataStore>({
  isLoaded: false,
  voyager1DailyPosition: null,
  voyager2DailyPosition: null,
  voyager1Images: null,
  voyager2Images: null,
});

export const loadData = async () => {
  const [
    voyager1DailyPosition,
    voyager2DailyPosition,
    voyager1Images,
    voyager2Images,
  ] = await Promise.all([
    d3.csv(
      '/data/voyager1-daily-position.csv'
    ) as Promise<VoyagerDailyPosition>,
    d3.csv(
      '/data/voyager2-daily-position.csv'
    ) as Promise<VoyagerDailyPosition>,
    d3.csv('/data/voyager1-images.csv') as Promise<VoyagerImages>,
    d3.csv('/data/voyager2-images.csv') as Promise<VoyagerImages>,
  ]);

  data.set({
    isLoaded: true,
    voyager1DailyPosition,
    voyager2DailyPosition,
    voyager1Images,
    voyager2Images,
  });
};
