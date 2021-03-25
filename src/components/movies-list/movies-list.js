import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { ru } from 'date-fns/locale';
import 'antd/dist/antd.css';
import { Image, Tag } from 'antd';

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
    // let acc = 0;

    const reduceLength = (text, currentLength) => {
      const newTextLength = currentLength - 1;
      if (text[newTextLength] !== ' ') {
        /* eslint no-unused-vars: "off" */
        return reduceLength(text, newTextLength);
      }
      return newTextLength;
    };

    descriptionsArr.forEach((description) => {
      const countChildElementsHeight = (element) => {
        let acc = 0;

        for (const child of element) {
          acc += child.scrollHeight;
        }

        return acc;
      };

      let lessLength = maxlength - 10;

      if (countChildElementsHeight(description.parentElement.children) > description.parentElement.offsetHeight) {
        while (
          countChildElementsHeight(description.parentElement.children) > description.parentElement.offsetHeight ||
          description.offsetHeight >
            description.parentElement.offsetHeight - (description.parentElement.scrollHeight - description.offsetHeight)
        ) {
          const currentLength = reduceLength(description.innerText, lessLength);

          const txt = `${description.innerText.slice(0, currentLength)}`;
          description.innerText = `${txt.trim()}...`;

          lessLength -= 10;
        }
      }
    });
  }

  render() {
    const { moviesList } = this.props;
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
        attachedGenres = movie.genre_ids.map((attachedGenre) => {
          const idx = genreList.find((item) => item.id === attachedGenre);
          return (
            // <span className="movie__genre--name" key={attachedGenre}>
            //   {idx.name}
            // </span >
            <Tag key={attachedGenre}>{idx.name}</Tag>
          );
        });
      }

      const ReleaseDate = () => {
        if (!Date.parse(movie.release_date)) {
          return <div className="movie__no-release-date">Release date not available</div>;
        }
        return (
          <div className="movie__release-date">
            {format(Date.parse(movie.release_date), 'MM/dd/yyyy', { locale: ru })}
          </div>
        );
      };

      return (
        <div className="movie" key={movie.id}>
          <a href="#" className="movie__link">
            <Image
              width={183}
              src={mapiService.getPosterUrl(movie.poster_path, 'w185')}
              preview={{
                src: mapiService.getPosterUrl(movie.poster_path, 'original'),
              }}
            />
          </a>
          <div className="movie__description">
            <h2 className="movie__name">{movie.original_title}</h2>
            <ReleaseDate />
            <div className="movie__genre">{attachedGenres}</div>
            <div className="movie__description--text">{movie.overview}</div>
          </div>
        </div>
      );
    });

    return (
      <section className="movies">
        <section className="movies-list">{recievedMovies}</section>
      </section>
    );
  }
}

MoviesList.propTypes = {
  moviesList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
