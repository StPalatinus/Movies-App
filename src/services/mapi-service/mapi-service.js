import posterNone from '../../img/no_poster.svg';

const API_KEY = process.env.REACT_APP_APY_KEY;
const BASE_URL = 'api.themoviedb.org/3';
const LANGUAGE = 'en-US';
const defaultPage = 1;
const sortType = 'created_at.asc';

const createSearchURL = (key, urlBase, lang, movieToSearch, page) => {
  if (!movieToSearch) {
    const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}`;
    return url;
  }

  const url = `https://${urlBase}/search/movie?api_key=${key}&language=${lang}&query=${movieToSearch}&include_adult=false&page=${
    page || defaultPage
  }`;

  return url;
};

class MapiService {
  async getMovie(movieToSearch, pageNum) {
    const searchUrl = createSearchURL(API_KEY, BASE_URL, LANGUAGE, movieToSearch, pageNum);
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${searchUrl} , received ${response.status}`);
    }

    const body = await response.json();

    const responseResult = {
      movies: body.results,
      page: body.page,
      totalMovies: body.total_results,
      responseStatus: response.status,
    };

    return responseResult;
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

  async getGenreConfig() {
    const url = `https://${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=${LANGUAGE}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    }

    const body = await response.json();
    console.log(body);
    return body.genres;
  }

  async generateGuestsessionID() {
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
    const restoreOldSession = () => JSON.parse(localStorage.getItem('guestSession'));
    const hasSassion = restoreOldSession();

    if (!hasSassion) {
      const result = await this.generateGuestsessionID();
      return result;
    }
    if (hasSassion) {
      const storedExpireDate = Date.parse(hasSassion.expires_at);
      const currentTime = Date.now();

      if (storedExpireDate < currentTime) {
        const result = await this.generateGuestsessionID();
        return result;
      }
    }

    return hasSassion.guest_session_id;
  }

  async rateMovie(rateValue, movieId, sessionID) {
    const url = `https://${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${sessionID}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },

      body: JSON.stringify({ value: rateValue }),
    });

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    }

    const body = await response.json();
    return body;
  }

  async getUserRatedMovies(sessionID) {
    const url = `https://${BASE_URL}/guest_session/${sessionID}/rated/movies?api_key=${API_KEY}&language=${LANGUAGE}&sort_by=${sortType}&page=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    }

    const body = await response.json();

    const responseResult = {
      movies: body.results,
      page: body.total_pages,
      moviesCount: body.page,
    };

    return responseResult;
  }
}

const mapiService = new MapiService();
export default mapiService;
