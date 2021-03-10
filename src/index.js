import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './components/header';
import MoviesList from './components/movies-list';
import Footer from './components/footer';
import MapiService from './services/mapi-service';

class MoviesApp extends React.Component {

  constructor() {
    super();

    this.mapiService = new MapiService();
    let movies ;

    this.state = {
      // footerText: "Footer Content",
    };

    this.searchMovie = (movieTosearch) => {
      console.log(movieTosearch);
      movies = this.mapiService.getMovie(movieTosearch);
      console.log(movies);
    };

  }

  render() {

    
    

    // const footerContent = <div className="testClasss">{ this.state.footerText }</div>

    return (
      <section id="appbody">
        < Header searchMovie = {this.searchMovie} />
        < MoviesList />
        < Footer />
      </section>
    );
  }
}

ReactDOM.render(<MoviesApp />, document.getElementById('moviesapp'));
