import posterNone from '../../img/poster_none.jpg';

const apiKey = '82a13cf2a29a7a4cf5cdfa5f53773181';
const baseURL = 'api.themoviedb.org/3';
// const language = "ru-RU";
const language = 'en-US';
// const posterSize = 'w185';

const createSearchURL = (key, urlBase, lang, movieToSearch) => {
  if (!movieToSearch) {
    const url = `${baseURL}/movie/top_rated?api_key=${apiKey}&language=${language}`;
    return url;
  }

  const url = `https://${urlBase}/search/movie?api_key=${key}&language=${lang}&query=${movieToSearch}&page=1&include_adult=false`;

  return url;
};

class MapiService {
  async getMovie(movieToSearch) {
    const url = createSearchURL(apiKey, baseURL, language, movieToSearch);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    }

    const body = await response.json();

    return body.results;
  }

  async getTopRated() {
    const url = createSearchURL(apiKey, baseURL, language);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    }

    console.log(response);
    const body = await response.json();
    return body;
  }

  getPosterUrl(posterPath, posterSize) {
    let posterURL;
    if (posterPath === null) {
      posterURL = `${posterNone}`;
    } else {
      posterURL = `http://image.tmdb.org/t/p/${posterSize}${posterPath}`;
    }

    return posterURL;
  }

  async downloadGenreConfig() {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=82a13cf2a29a7a4cf5cdfa5f53773181&language=en-US';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    }

    const body = await response.json();

    // localStorage.clear();
    localStorage.setItem('genres', JSON.stringify(body.genres));

    return body.genres;
  }

  getLocalGenreConfig() {
    let checkCount = 3;
    const localConfig = () => JSON.parse(localStorage.getItem('genres'));

    const timerID = setInterval(() => {
      checkCount -= 1;

      // const localConfig = () => JSON.parse(localStorage.getItem('genres'))

      // console.log(checkCount);

      /* eslint no-unused-expressions: "off" */
      localConfig() ? clearInterval(timerID) : localConfig();

      if (checkCount <= 0) {
        clearInterval(timerID);
      }
    }, 500);
    return localConfig();
  }
}

const mapiService = new MapiService();
export default mapiService;
