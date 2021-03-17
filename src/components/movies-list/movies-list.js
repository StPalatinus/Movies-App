import React from 'react';
import PropTypes from 'prop-types';
import mapiService from '../../services/mapi-service';
// import posterNone from '../../img/poster_none.jpg';

import './movies-list.css';


export default class MoviesList extends React.Component {
  // constructor(props) {
  //   super(props);

  //   // this.state = {
  //   //   name: "Movie1",
  //   // }
  // }

  componentDidMount() {
    const genreList = mapiService.getLocalGenreConfig();
    console.log(genreList);
  }

  render() {
    const { moviesList } = this.props
    const genreList = mapiService.getLocalGenreConfig();
    // console.log(moviesList[0].id);
    // console.log(moviesList[0].id);
    console.log(moviesList);

    const recievedMovies = moviesList.map((movie) => { 

      let attachedGenres;

      if (movie.genre_ids.length === 0) {
        attachedGenres = null;
      } else {
        attachedGenres = movie.genre_ids.map((attachedGenre) =>  
      // <span className="movie__genre--name">{attachedGenre}</span>
      {
        const idx = genreList.find(item => item.id === attachedGenre);
      return <span className="movie__genre--name">{idx.name}</span>
      }
      );
      }

     return  (<div className="movie">
      <a href="#" className="movie__link">
        <img src={mapiService.createPosterUrl(movie.poster_path)}
            className="movie__poster" 
            alt={movie.original_title} 
            width="183" 
            height="281"/>
      </a>
      <div className="movie__description">
        <h2 className="movie__name">{movie.original_title}</h2>
        <div className="movie__release-date">{movie.release_date}</div>
        <div className="movie__genre">
        {attachedGenres}
        </div>
        <div className="movie__description--text">
          { movie.overview }
        </div>
      </div>
    </div>)
    });

    return (
      <section className="movies">
        <section className="movies-list">
        { recievedMovies }
          </section>
        </section>
    );
  }
}

MoviesList.propTypes = {
  moviesList: PropTypes.arrayOf(PropTypes.object).isRequired,
};