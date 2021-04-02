import posterNone from '../../img/posternone.jpg';

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

// localStorage.clear("genres");

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
    const url = `https://${baseURL}/genre/movie/list?api_key=${apiKey}&language=${language}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
      // return false;
    }

    const body = await response.json();

    // localStorage.clear();
    localStorage.setItem('genres', JSON.stringify(body.genres));

    return body.genres;
  }

  getLocalGenreConfig() {
    let checkCount = 3;
    const getConfig = () => JSON.parse(localStorage.getItem('genres'));
    let localConfig = getConfig();

    const timerID = setInterval(() => {
      checkCount -= 1;

      // const getConfig = () => JSON.parse(localStorage.getItem('genres'))

      // console.log(checkCount);

      const retyConfig = () => {
        localConfig = getConfig();
      };

      // if (localConfig) {
      //   clearInterval(timerID)
      // }

      console.log(checkCount);
      if (localConfig || checkCount <= 0) {
        clearInterval(timerID);
      }

      retyConfig();
    }, 150);
    return localConfig;
  }
}

const mapiService = new MapiService();
export default mapiService;
