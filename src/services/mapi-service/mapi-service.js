export default class MapiService{
  async getMovies (url) {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Could not receive data from ${url} , received ${response.status}`);
      }

      console.log(response);
      const body = await response.json();
      return body;
  }
}