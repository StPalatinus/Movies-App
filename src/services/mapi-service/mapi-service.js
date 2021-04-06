import posterNone from '../../img/posternone.jpg';

const apiKey = '82a13cf2a29a7a4cf5cdfa5f53773181';
const baseURL = 'api.themoviedb.org/3';
// const language = "ru-RU";
const language = 'en-US';
// const posterSize = 'w185';
const defaultPage = 1;
// const totalPages = 8;

const createSearchURL = (key, urlBase, lang, movieToSearch, page) => {
  if (!movieToSearch) {
    const url = `${baseURL}/movie/top_rated?api_key=${apiKey}&language=${language}`;
    return url;
  }

  const url = `https://${urlBase}/search/movie?api_key=${key}&language=${lang}&query=${movieToSearch}&include_adult=false&page=${
    page || defaultPage
  }`;
  // const url = `https://${urlBase}/search/movie?api_key=${key}&language=${lang}&query=${movieToSearch}&include_adult=false&page=${page || defaultPage}&${totalPages}`;

  return url;
};

const TOP_RATED = `https://${baseURL}/movie/top_rated?api_key=${apiKey}&language=${language}`;

// localStorage.clear("genres");

class MapiService {
  async getMovie(movieToSearch, pageNum) {
    const searchUrl = createSearchURL(apiKey, baseURL, language, movieToSearch, pageNum);
    const response = await fetch(searchUrl);
    // console.log(response);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${searchUrl} , received ${response.status}`);
    }

    const body = await response.json();
    // console.log(body);
    // console.log(body.page);
    // console.log(body.total_results);

    const { results, page } = body;
    const totalPages = body.total_results;
    const responseStatus = response.status;

    return { results, page, totalPages, responseStatus };
  }

  async getTopRated() {
    const response = await fetch(TOP_RATED);

    if (!response.ok) {
      // return response.status;
      throw new Error(`Could not receive data from ${TOP_RATED} , received ${response.status}`);
    }

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

      // console.log(checkCount);
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
