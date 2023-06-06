<script lang="ts">
import { data } from '@/stores/data';
import { player } from '@/stores/player';
import dayjs from 'dayjs';

export let missionNumber = 1;

$: images = missionNumber == 1 ? $data.voyager1Images : $data.voyager2Images;

$: imagesUntilDate = images
  .filter((image) => {
    return dayjs(image.date).toDate() <= $player.date;
  })
  .sort((a, b) => b.date.localeCompare(a.date));
</script>

<ol>
  {#each imagesUntilDate as image (image.image_url)}
    <li>
      <picture>
        <img src={image.image_url} alt={image.title} />
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
