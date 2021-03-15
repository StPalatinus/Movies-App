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

    let movies ;

    this.state = {
      moviesList: [],
      selectedPage: 1,
    };

    this.searchMovie = async (movieTosearch) => {
      
      movies = await mapiService.getMovie(movieTosearch);

      this.setState(() => ({
          moviesList: movies,
      }));
    };

  }

  componentDidMount() {
    console.log(this.state);
  }

  render() {

    console.log(this.state.moviesList.length);
    console.log(this.state.selectedPage);
    return (
      <section id="appbody">
        < Header searchMovie = {this.searchMovie} />
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
