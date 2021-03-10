const apiKey = "82a13cf2a29a7a4cf5cdfa5f53773181";
const baseUrl = "api.themoviedb.org/3";
// const language = "ru";
const language = "en-US";

// const url =`https://api.themoviedb.org/3/movie/76341?api_key=${apiKey}&language=ru`;
// const url2 = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieToSearch}&page=1&include_adult=false`;
// ${baseUrl}/search/movie?&api_key=${API_KEY}&language=${LANGUAGE}&query=${movieToSearch}`


const createURL = (key, movieToSearch) => {
  const url = `https://${baseUrl}/search/movie?api_key=${key}&language=${language}&query=${movieToSearch}&page=1&include_adult=false`;
  // const url = `https://${baseUrl}/search/movie?api_key=${key}&language=${language}=${movieToSearch}&page=1&include_adult=false`;
  return url;
}


export default class MapiService{
  async getMovie (movieToSearch) {
      const url = createURL(apiKey, movieToSearch);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Could not receive data from ${url} , received ${response.status}`);
      }

      console.log(response);
      const body = await response.json();
      return body;
  }
}