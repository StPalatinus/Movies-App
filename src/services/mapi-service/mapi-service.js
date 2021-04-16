import posterNone from '../../img/posternone.jpg';

const API_KEY = '82a13cf2a29a7a4cf5cdfa5f53773181';
const BASE_URL = 'api.themoviedb.org/3';
// const language = "ru-RU";
const LANGUAGE = 'en-US';
// const posterSize = 'w185';
const defaultPage = 1;
// const totalPages = 8;
const sortType = 'created_at.asc';
// const sortType = 'created_at.desc';

const createSearchURL = (key, urlBase, lang, movieToSearch, page) => {
  if (!movieToSearch) {
    const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}`;
    return url;
  }

  const url = `https://${urlBase}/search/movie?api_key=${key}&language=${lang}&query=${movieToSearch}&include_adult=false&page=${
    page || defaultPage
  }`;
  // const url = `https://${urlBase}/search/movie?api_key=${key}&language=${lang}&query=${movieToSearch}&include_adult=false&page=${page || defaultPage}&${totalPages}`;

  return url;
};

const TOP_RATED = `https://${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}`;

// localStorage.clear("genres");

class MapiService {
  async getMovie(movieToSearch, pageNum) {
    const searchUrl = createSearchURL(API_KEY, BASE_URL, LANGUAGE, movieToSearch, pageNum);
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
    const url = `https://${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${LANGUAGE}`;
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

      // const getConfig = () => JSON.parse(localStorage.getItem('genres'));

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

  async generateGuestsessionID() {
    // localStorage.clear("genres");
    // const restoreOldSession = () => JSON.parse(localStorage.getItem('guestSession'));
    // const hasSassion = restoreOldSession();

    // if(hasSassion) {

    //   const storedExpireDate = Date.parse(hasSassion.expires_at);
    //   const currentTime = Date.now();

    //   if(storedExpireDate > currentTime) {

    //     return hasSassion.guest_session_id;
    //   }
    // }

    const url = `https://${BASE_URL}/authentication/guest_session/new?api_key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    }

    const body = await response.json();
    localStorage.setItem('guestSession', JSON.stringify(body));

    return body.guest_session_id;
  }

  async getGuestsessionID() {
    // localStorage.clear("genres");
    const restoreOldSession = () => JSON.parse(localStorage.getItem('guestSession'));
    const hasSassion = restoreOldSession();

    if (!hasSassion) {
      const storedExpireDate = Date.parse(hasSassion.expires_at);
      const currentTime = Date.now();

      if (storedExpireDate < currentTime) {
        const result = await this.generateGuestsessionID();
        return result;
      }
    }

    return hasSassion.guest_session_id;

    // const url = `https://${BASE_URL}/authentication/guest_session/new?api_key=${API_KEY}`;
    // const response = await fetch(url);

    // if (!response.ok) {
    //   throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    // }

    // const body = await response.json();
    // localStorage.setItem('guestSession', JSON.stringify(body));

    // return body.guest_session_id;
  }

  async rateMovie(rateValue, movieId, sessionID) {
    const url = `https://${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${sessionID}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      // body: JSON.stringify(user)
      body: JSON.stringify({ value: rateValue }),
    });

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    }

    const body = await response.json();
    // console.log(body);
    return body;
  }

  async getUserRatedMovies(sessionID) {
    const url = `https://${BASE_URL}/guest_session/${sessionID}/rated/movies?api_key=${API_KEY}&language=${LANGUAGE}&sort_by=${sortType}&page=1`;
    // &page=${page || defaultPage}

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    }

    const body = await response.json();
    return body;
  }
}

const mapiService = new MapiService();
export default mapiService;
