<script lang="ts">
import { basePath } from '@/env';
import { data } from '@/stores/data';
import { player } from '@/stores/player';
import dayjs from 'dayjs';

export let missionNumber: 1 | 2;

const images = $data.voyagerImages[missionNumber];

$: imagesUntilDate = images
  .filter((image) => {
    return dayjs(image.date).toDate() <= $player.date;
  })
  .sort((a, b) => b.date.localeCompare(a.date));
</script>

<ol>
  {#each imagesUntilDate as image (image.image_id)}
    <li>
      <picture>
        <img src="{basePath}/images/gallery/voyager{missionNumber}/{image.image_id}.webp" alt={image.title} />
        <legend>
          <a href={image.page_url} target="_blank" rel="noopener noreferrer">
            {image.title}
          </a>
          <br />
          <span> {dayjs(image.date).format('DD/MM/YYYY')} </span>
        </legend>
      </picture>
    </li>
  {/each}
</ol>

<style lang="scss">
ol {
  overflow-y: scroll;
  list-style: none;
  height: 100%;
  padding: 1rem;

  display: flex;
  flex-direction: column-reverse;
  gap: 1.25rem;

  background-color: #121212;
  user-select: none;

  li {
    margin: 0;
    transition: all 200ms;

    picture {
      img {
        width: 100%;
        max-height: 24rem;

        object-fit: cover;
      }

      legend {
        margin-top: 0.25rem;
        line-height: 1.25rem;

        font-size: 1rem;
        color: white;

        a {
          color: white;
        }

        span {
          font-size: 0.75rem;
          color: #999;
        }
      }
    }
  }
}
</style>
