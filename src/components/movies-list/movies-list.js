import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { ru } from 'date-fns/locale';
import 'antd/dist/antd.css';
import { Image, Tag, Rate, Spin } from 'antd';
import ErrorBoundary from '../error-boundry';

import mapiService from '../../services/mapi-service';

import './movies-list.css';

export default class MoviesList extends React.Component {
  constructor(props) {
    super(props);

    this.movieRef = React.createRef();
    this.descriptionTextRef = null;
    this.descriptionTextRefsArr = [];
    this.descriptionTextRefsArr.current = [];
    this.addDescriptionTextRefToArray = (element) => {
      if (element && !this.descriptionTextRefsArr.current.includes(element)) {
        this.descriptionTextRefsArr.current.push(element);
      }
    };

    MoviesList.defaultProps = {
      ratededList: [],
      sessionID: null,
      genres: [],
      getUserRatedMovies: () => {},
    };

    this.formatText = () => {
      const descriptionsArr = this.descriptionTextRefsArr.current;
      const maxlength = 200;

      const reduceLength = (text, currentLength) => {
        if (!currentLength || currentLength <= 0) {
          return 0;
        }

        const newTextLength = currentLength - 1;
        if (text[newTextLength] !== ' ') {
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

    this.rateMovie = async (rateValue, movieId, SID) => {
      mapiService.rateMovie(rateValue, movieId, SID);

      return rateValue;
    };

    this.getReadMovieRating = (movie, ratedMovies) => {
      if (movie.rating) {
        return movie.rating;
      }

      let res;
      const rateListIDX = ratedMovies.findIndex((ratedID) => ratedID.id === movie.id);

      if (rateListIDX !== -1) {
        res = ratedMovies[rateListIDX].rating;
      }

      return res;
    };
  }

  componentDidMount() {
    this.addDescriptionTextRefToArray();
    this.formatText();
  }

  componentDidUpdate() {
    this.props.getUserRatedMovies();
    this.formatText();
  }

  render() {
    const { moviesList, ratededList } = this.props;
    const genreList = this.props.genres;

    const recievedMovies = moviesList.map((movie) => {
      let attachedGenres;

      if (movie.genre_ids.length === 0) {
        attachedGenres = null;
      } else {
        attachedGenres = movie.genre_ids.map((attachedGenre) => {
          const idx = genreList.find((item) => item.id === attachedGenre);
          return <Tag key={attachedGenre}>{idx.name}</Tag>;
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

      const movieVoteAverege = (voteAverage) => {
        let color;

        switch (true) {
          case voteAverage <= 3:
            color = '#E90000';
            break;
          case voteAverage <= 5:
            color = '#E97E00';
            break;
          case voteAverage <= 7:
            color = '#E9D100';
            break;
          case voteAverage > 7:
            color = '#66E900';
            break;
          default:
            color = 'black';
        }

        const voteAverageStyle = {
          border: `2px solid ${color}`,
        };

        const correctedEverage = (everage) => {
          if (everage === 0 || everage === 10) {
            return everage;
          }
          return everage.toPrecision(2);
        };

        return (
          <div className="movie__vote_averege" style={voteAverageStyle}>
            <div className="movie__vote_averege--value">{correctedEverage(voteAverage)}</div>
          </div>
        );
      };

      const preparedMoviesList = this.props.isDesktop ? (
        <div className="movie" key={movie.id}>
          <a href="#" className="movie__link">
            <Image
              width={185}
              alt={movie.original_title}
              src={mapiService.getPosterUrl(movie.poster_path, 'w185')}
              preview={{
                src: mapiService.getPosterUrl(movie.poster_path, 'original'),
              }}
              fallback=""
            />
          </a>
          <div className="movie__description" ref={this.movieRef}>
            <h2 className="movie__description--name">{movie.original_title}</h2>
            {movieVoteAverege(movie.vote_average)}
            <ReleaseDate />
            <div className="movie__genre">{attachedGenres}</div>
            <div className="movie__description--text" ref={this.addDescriptionTextRefToArray}>
              {movie.overview}
            </div>
            <Rate
              className="movie__rate"
              allowHalf
              allowClear={false}
              defaultValue={this.getReadMovieRating(movie, ratededList)}
              count={10}
              onChange={(rateValue, movieId = movie.id, SID = this.props.sessionID) => {
                this.rateMovie(rateValue, movieId, SID);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="movie" key={movie.id}>
          <a href="#" className="movie__link">
            <Image
              width={92}
              alt={movie.original_title}
              src={mapiService.getPosterUrl(movie.poster_path, 'w92')}
              preview={{
                src: mapiService.getPosterUrl(movie.poster_path, 'original'),
              }}
              fallback=""
            />
          </a>
          <div className="movie__description" ref={this.movieRef}>
            <h2 className="movie__description--name">{movie.original_title}</h2>
            {movieVoteAverege(movie.vote_average)}
            <ReleaseDate />
            <div className="movie__genre">{attachedGenres}</div>
            <div className="movie__description--text" ref={this.addDescriptionTextRefToArray}>
              {movie.overview}
            </div>
            <Rate
              className="movie__rate"
              allowHalf
              allowClear={false}
              defaultValue={this.getReadMovieRating(movie, ratededList)}
              count={10}
              onChange={(rateValue, movieId = movie.id, SID = this.props.sessionID) => {
                this.rateMovie(rateValue, movieId, SID);
              }}
            />
          </div>
        </div>
      );

      return <React.Fragment key={movie.id}>{preparedMoviesList}</React.Fragment>;
    });

    const componentContent = this.props.sessionID ? recievedMovies : <Spin />;

    return (
      <ErrorBoundary>
        <section className="movies">
          <section className="movies-list">{componentContent}</section>
        </section>
      </ErrorBoundary>
    );
  }
}

MoviesList.propTypes = {
  moviesList: PropTypes.arrayOf(PropTypes.object).isRequired,
  sessionID: PropTypes.string,
  ratededList: PropTypes.arrayOf(PropTypes.object),
  genres: PropTypes.arrayOf(PropTypes.object),
  getUserRatedMovies: PropTypes.func,
  isDesktop: PropTypes.bool.isRequired,
};
