<script lang="ts">
import { Link } from 'svelte-routing';
</script>

<main>
  <h1>Voyager's Journey</h1>

  <ol class="missions">
    <li>
      <Link to="/voyager/1">
        <picture>
          <img src="/images/posters/voyager1.jpg" alt="Voyager 1" />
          <legend>Voyager 1</legend>
        </picture>
      </Link>
    </li>

    <li>
      <Link to="/voyager/2">
        <picture>
          <img src="/images/posters/voyager2.jpg" alt="Voyager 2" />
          <legend>Voyager 2</legend>
        </picture>
      </Link>
    </li>
  </ol>
</main>

<style lang="scss">
main {
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: #121212;
}

h1 {
  font-size: 4rem;
  color: #bd9526;

  text-align: center;
  margin-bottom: 4rem;
}

ol.missions {
  max-width: 100vw;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;

  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0 2rem;

  li {
    opacity: 0.75;
    margin: 0;
    transition: all 200ms;

    :global(a) {
      color: white;
      text-decoration: none;
    }

    picture {
      img {
        width: 100%;
        max-width: 30rem;
      }

      legend {
        margin-top: -3.5rem;
        margin-left: 1rem;

        font-size: 2rem;
        font-weight: bold;
      }
    }

    &:hover {
      opacity: 1;
      transform: scale(1.05);
      z-index: 2;
    }
  }
}
</style>
