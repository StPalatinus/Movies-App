import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { ru } from 'date-fns/locale';
import 'antd/dist/antd.css';
import { Image, Tag, Rate } from 'antd';

// import loadingImage from '../../img/loading128.png';
import mapiService from '../../services/mapi-service';
// import posterNone from '../../img/poster_none.jpg';

import './movies-list.css';

export default class MoviesList extends React.Component {
  constructor(props) {
    super(props);

    const { sessionID } = this.props;
    console.log(sessionID);
    // MoviesList.defaultProps = {

    // }

    // this.state = {
    //   posterIsLoading: true,
    // }

    this.formatText = () => {
      const descriptionsArr = document.querySelectorAll('.movie__description--text');
      // console.log(descriptionsArr);
      const maxlength = 200;
      // let acc = 0;

      const reduceLength = (text, currentLength) => {
        if (!currentLength || currentLength <= 0) {
          return 0;
        }

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

        // if (countChildElementsHeight(description.parentElement.children) > description.parentElement.offsetHeight) {

        while (
          countChildElementsHeight(description.parentElement.children) > description.parentElement.offsetHeight ||
          description.offsetHeight >
            description.parentElement.offsetHeight - (description.parentElement.scrollHeight - description.offsetHeight)
        ) {
          const currentLength = reduceLength(description.innerText, lessLength);

          if (currentLength === 0) {
            description.innerText = null;
            return;
          }

          const txt = `${description.innerText.slice(0, currentLength)}`;
          description.innerText = `${txt.trim()}...`;

          lessLength -= 10;
        }
      });
    };

    this.rateMovie = (rateValue, movieId, SID) => {
      mapiService.rateMovie(rateValue * 2, movieId, SID);
      // console.log(rateValue * 2);
      // console.log(SID);
    };
  }

  componentDidMount() {
    mapiService.getLocalGenreConfig();
    this.formatText();
  }

  componentDidUpdate() {
    this.formatText();
  }

  render() {
    const { moviesList, sessionID } = this.props;
    // const { posterIsLoading } = this.state;
    const genreList = mapiService.getLocalGenreConfig();

    const recievedMovies = moviesList.map((movie) => {
      let attachedGenres;

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
        // <div className="movie" key={movie.id} onClick={() => {console.log("Movie clicked")}}></div>
        <div className="movie" key={movie.id}>
          <a href="#" className="movie__link">
            <Image
              width={183}
              alt={movie.original_title}
              src={mapiService.getPosterUrl(movie.poster_path, 'w185')}
              preview={{
                src: mapiService.getPosterUrl(movie.poster_path, 'original'),
              }}
              fallback=""
              // preview={{
              //   src: posterIsLoading ? loadingImage : previewImage,
              // }}
            />
          </a>
          <div className="movie__description">
            <h2 className="movie__name">{movie.original_title}</h2>
            <ReleaseDate />
            <div className="movie__genre">{attachedGenres}</div>
            <div className="movie__description--text">{movie.overview}</div>
            <Rate
              allowHalf
              allowClear={false}
              defaultValue={0}
              // value={0}
              // count={10}
              onChange={(rateValue, movieId, SID) => {
                this.rateMovie(rateValue, (movieId = movie.id), (SID = this.props.sessionID));
              }}
            />
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
  sessionID: PropTypes.string.isRequired,
};
