import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './components/header';
import MoviesList from './components/movies-list';
import Footer from './components/footer';
import mapiService from './services/mapi-service';

class MoviesApp extends React.Component {

  constructor() {
    super();

    this.state = {
      moviesList: [],
      selectedPage: 1,
    };

    this.getMovie = async (movieTosearch) => {
      
      const movies = await mapiService.getMovie(movieTosearch);

      this.setState(() => ({
          moviesList: movies,
      }));
    };
  }

  componentDidMount() {
    
    const recievedGenres = mapiService.downloadGenreConfig();
    console.log(recievedGenres);

    // const tra = mapiService.getLocalGenreConfig();
    // console.log(tra);

    // recievedGenres.then((result) => console.log(result));

    // const ava = ( async () => {
    //   const recievedGenres = await mapiService.renewGenreConfig();
    //   return recievedGenres;
    // })();
      
    // ava.then((result) => console.log(result));
  };

  render() {

    return (
      <section id="appbody">
        < Header getMovie = {this.getMovie} />
        < MoviesList moviesList = {this.state.moviesList}/>
        < Footer 
          moviesCount = { this.state.moviesList.length } 
          moviesPerPage = { 6 }
          selectedPage = { this.state.selectedPage }
        />
      </section>
    );
  }
}

ReactDOM.render(<MoviesApp />, document.getElementById('moviesapp'));
