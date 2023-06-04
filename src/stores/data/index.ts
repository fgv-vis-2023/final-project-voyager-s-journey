import * as d3 from 'd3';
import { writable } from 'svelte/store';

type VoyagerDailyPosition = d3.DSVRowArray<
  'date' | 'range' | 'se_lat' | 'se_lon' | 'hg_lat' | 'hg_lon' | 'ihg_lon'
>;

interface DataStore {
  isLoaded: boolean;
  voyager1DailyPosition?: VoyagerDailyPosition;
  voyager2DailyPosition?: VoyagerDailyPosition;
}

export const data = writable<DataStore>({
  isLoaded: false,
  voyager1DailyPosition: null,
  voyager2DailyPosition: null,
});

export const loadData = async () => {
  const [voyager1DailyPosition, voyager2DailyPosition] = await Promise.all([
    d3.csv(
      './data/voyager1-daily-position.csv'
    ) as Promise<VoyagerDailyPosition>,
    d3.csv(
      './data/voyager2-daily-position.csv'
    ) as Promise<VoyagerDailyPosition>,
  ]);

  data.set({
    isLoaded: true,
    voyager1DailyPosition,
    voyager2DailyPosition,
  });
};
