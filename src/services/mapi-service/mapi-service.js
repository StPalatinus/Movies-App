import posterNone from '../../img/poster_none.jpg';

const apiKey = "82a13cf2a29a7a4cf5cdfa5f53773181";
const baseURL = "api.themoviedb.org/3";
// const language = "ru-RU";
const language = "en-US";
const posterSize = "w185";

// const url =`https://api.themoviedb.org/3/movie/76341?api_key=${apiKey}&language=ru`;
// const url2 = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieToSearch}&page=1&include_adult=false`;
// ${baseURL}/search/movie?&api_key=${API_KEY}&language=${LANGUAGE}&query=${movieToSearch}`


const createURL = (key, urlBase, lang, movieToSearch) => {
  if (!movieToSearch) {
    const url =  `${baseURL}/movie/top_rated?api_key=${apiKey}&language=${language}`;
    return url;
  }
  const url = `https://${urlBase}/search/movie?api_key=${key}&language=${lang}&query=${movieToSearch}&page=1&include_adult=false`;
  // const url = `https://${baseURL}/search/movie?api_key=${key}&language=${language}=${movieToSearch}&page=1&include_adult=false`;
  
  // request movie
  // https://api.themoviedb.org/3/movie/12345?api_key=82a13cf2a29a7a4cf5cdfa5f53773181&language=en-US

  // request configuration
  // https://api.themoviedb.org/3/configuration?api_key=82a13cf2a29a7a4cf5cdfa5f53773181
  return url;
}


class MapiService {
  async getMovie (movieToSearch) {

    const url = createURL(apiKey, baseURL, language, movieToSearch);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    }

    const body = await response.json();
    console.log(response);
    return body.results;
  }

  async getTopRated () {

    const url = createURL(apiKey, baseURL, language);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not receive data from ${url} , received ${response.status}`);
    }

    console.log(response);
    const body = await response.json();
    return body;
  }

  createPosterUrl (posterPath) {
    let posterURL;
    if (posterPath === null) {
      posterURL = `${ posterNone }`;
      // posterURL = "../../img/poster_none.jpg"
      // posterURL = "D:/Git_Clones/movies-app/src/img/poster_none.jpg"
    } else {
      posterURL = `http://image.tmdb.org/t/p/${posterSize}${posterPath}`;
    }
      
    return posterURL;
  }
}

const mapiService = new MapiService();
export default mapiService;