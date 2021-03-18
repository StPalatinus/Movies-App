import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { ru } from 'date-fns/locale'

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
    
    mapiService.getLocalGenreConfig();
    // const genreList = mapiService.getLocalGenreConfig();
    // console.log(genreList);
  }

  componentDidUpdate() {

    const descriptionsArr = document.querySelectorAll('.movie__description--text');
    const maxlength = 200;

    const reduceLength = (text, currentLength) => {
      const reducedLength = currentLength - 1;

        if (text[reducedLength] !== " ") {
 
          return reduceLength(text, reducedLength );
        } 
        
      return reducedLength ;
    };

    descriptionsArr.forEach((description) => {
      console.log(description);
      // console.log(description.parentElement);
      // console.log(description.parentElement.offsetHeight);
      // console.log(description.parentElement.scrollHeight);
      
      
      if (description.offsetHeight < description.scrollHeight) {
        
        console.log(description.parentElement.offsetHeight - 
        (description.parentElement.scrollHeight - description.offsetHeight));

        description.height = 
        `${description.parentElement.offsetHeight - 
      (description.parentElement.offsetHeight - description.offsetHeight)} px`;
        
        const lengthToBSP = reduceLength(description.innerText, maxlength);
        
        description.innerText = `${description.innerText.slice( 0, lengthToBSP )  }...`;
      }
    });
  }
  
  render() {
    const { moviesList } = this.props
    const genreList = mapiService.getLocalGenreConfig();

    // console.log(moviesList);

    const recievedMovies = moviesList.map((movie) => { 

      let attachedGenres;
 
      // console.log(releaseDate);
      // if (Object.prototype.toString.call(releaseDate) === "[object Date]") {
      //   // it is a date
      //   /* eslint no-restricted-globals: ["off", "isNaN"] */
      //   if (isNaN(releaseDate.getTime())) {  // d.valueOf() could also work
      //     // date is not valid
          
      //     timeBlock = null;
      //     console.log(timeBlock);
      //     console.log("date is not valid");
      //   } else {
      //     // date is valid
          
      //     timeBlock = releaseDate;
      //     console.log(timeBlock);
      //     console.log(timeBlock);
      //     console.log("date is valid!");
      //   }
      // } else {
      //   // not a date
        
      //   timeBlock = null;
      //   console.log("not a date");
      // }
      // }
 

      if (movie.genre_ids.length === 0) {
        attachedGenres = null;
      } else {
        attachedGenres = movie.genre_ids.map((attachedGenre) =>  
      // <span className="movie__genre--name">{attachedGenre}</span>
      {
        const idx = genreList.find(item => item.id === attachedGenre);
      return <span className="movie__genre--name" key={attachedGenre}>{idx.name}</span>
      }
      );
      }

      const ReleaseDate = () => {
        if ( !Date.parse(movie.release_date) ) {
          return (<div className="movie__no-release-date">Release date not available</div>);
        }
        return (<div className="movie__release-date">{
          format(Date.parse(movie.release_date), 
          'MM/dd/yyyy', 
          {locale: ru})}
        </div>)
      }

     return  (<div className="movie" key={movie.id}>
      <a href="#" className="movie__link">
        <img src={mapiService.createPosterUrl(movie.poster_path)}
            className="movie__poster" 
            alt={movie.original_title} 
            width="183" 
            height="281"/>
      </a>
      <div className="movie__description">
        <h2 className="movie__name">{movie.original_title}</h2>
        <ReleaseDate />
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