import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Spin, Alert, Tabs } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
import MoviesList from './components/movies-list';
import FooterContent from './components/footer-content';
import mapiService from './services/mapi-service';
import ErrorBoundary from './components/error-boundry';
import errorDescr from './assets/error-descriptions';
import SearchForm from './components/search-form';

const debounce = require('lodash.debounce');

const { TabPane } = Tabs;
const { Header, Footer, Content } = Layout;

class MoviesApp extends React.Component {
  constructor() {
    super();

    this.state = {
      moviesList: [],
      ratedList: [],
      selectedPage: 1,
      selectedRatedPage: 1,
      moviesCount: 10,
      ratedMoviesCount: 20,
      loading: false,
      error: false,
      errMessage: null,
      errDescription: null,
      currentMovie: 'reted',
      sessionID: null,
    };

    this.onError = (errMessage, errDescription) => {
      this.setState(() => ({
        error: true,
        loading: false,
        errMessage,
        errDescription,
      }));
    };

    this.getMovie = async (movieTosearch, pageNum) => {
      this.setState(() => ({
        loading: true,
        currentMovie: movieTosearch,
        selectedPage: pageNum,
        error: false,
      }));

      try {
        const baseResponse = await mapiService.getMovie(movieTosearch, pageNum);

        if (baseResponse.responseStatus === 200 && baseResponse.movies.length === 0) {
          this.onError(errorDescr.resourceNotFound.errorName, errorDescr.resourceNotFound.errorDescrioption);
        }

        this.setState(() => ({
          moviesList: baseResponse.movies,
          loading: false,
          selectedPage: baseResponse.page,
          moviesCount: baseResponse.totalMovies,
        }));
      } catch (err) {
        this.onError(errorDescr.noData.errorName, errorDescr.noData.errorDescrioption);
      }
    };

    this.getGenreConfig = async () => {
      let genres;
      try {
        genres = await mapiService.getGenreConfig();

        this.setState(() => ({
          loading: true,
        }));
      } catch (err) {
        this.onError(err, errorDescr.noGenreConfig.errorName, errorDescr.noGenreConfig.errorDescrioption);
      }

      this.setState(() => ({
        genres,
        loading: false,
      }));
    };

    this.changePage = (page) => {
      this.getMovie(this.state.currentMovie, page);
      this.setState(() => ({
        selectedPage: page,
      }));
    };

    this.getsessionID = async () => {
      let guestsessionID;
      try {
        guestsessionID = await mapiService.getGuestsessionID();
      } catch (err) {
        this.onError(err, errorDescr.noSessionId.errorName, errorDescr.noSessionId.errorDescrioption);
      }

      this.setState(() => ({
        sessionID: guestsessionID,
      }));

      return guestsessionID;
    };

    this.getUserRatedMovies = async () => {
      const timerId = setInterval(async () => {
        this.setState(() => ({
          loading: true,
        }));

        if (this.state.sessionID) {
          clearInterval(timerId);

          try {
            const baseResponse = await mapiService.getUserRatedMovies(this.state.sessionID);

            this.setState(() => ({
              ratedList: baseResponse.movies,
              loading: false,
              selectedRatedPage: baseResponse.page,
              ratedMoviesCount: baseResponse.totalMovies,
            }));
          } catch (err) {
            this.onError(errorDescr.noData.errorName, errorDescr.noData.errorDescrioption);
          }
        }
      }, 100);
    };

    const debouncedGetMovie = debounce(this.getMovie, 500, {
      maxWait: 350,
    });

    this.onMovieSearch = (evt) => {
      let value;

      evt.preventDefault();
      if (evt.target.value) {
        value = evt.target.value;
      } else if (evt.target.firstChild) {
        value = evt.target.firstChild.value;
      }

      if (value === '' || !value) {
        return;
      }

      debouncedGetMovie(value, 1);
    };
  }

  componentDidMount() {
    this.getGenreConfig();
    this.getsessionID();
    this.getUserRatedMovies();
  }

  componentDidUpdate() {}

  render() {
    const { loading, error, errMessage, errDescription } = this.state;

    const hasData = !(loading || error);

    const errorMessage = <Alert message={errMessage} description={errDescription} type="error" />;
    const spinner = (
      <div className="spin-wraper">
        <Spin />
      </div>
    );

    const searchMovies = hasData ? (
      <MoviesList
        moviesList={this.state.moviesList}
        onError={this.onError}
        ratededList={this.state.ratedList}
        sessionID={this.state.sessionID}
        getUserRatedMovies={this.getUserRatedMovies}
        genres={this.state.genres}
      />
    ) : (
      spinner
    );
    const ratedMovies = hasData ? (
      <MoviesList
        moviesList={this.state.ratedList}
        onError={this.onError}
        ratededList={this.state.ratedList}
        sessionID={this.state.sessionID}
        getUserRatedMovies={this.getUserRatedMovies}
        genres={this.state.genres}
      />
    ) : (
      spinner
    );

    const searchFooterContent = error ? (
      <FooterContent />
    ) : (
      <FooterContent
        moviesCount={this.state.moviesCount}
        moviesPerPage={20}
        selectedPage={this.state.selectedPage}
        changePage={this.changePage}
        getMovie={this.getMovie}
      />
    );

    const ratedFooterContent = error ? (
      <FooterContent />
    ) : (
      <FooterContent
        moviesCount={this.state.ratedMoviesCount}
        moviesPerPage={20}
        selectedPage={this.state.selectedRatedPage}
        changePage={this.changePage}
        getMovie={this.getMovie}
      />
    );

    return (
      <ErrorBoundary>
        <Layout id="appbody">
          <section className="header-section">
            <Tabs className="chose-display-variant" defaultActiveKey="1" centered onChange={this.getUserRatedMovies}>
              <TabPane tab="Search" key="Search">
                <Header className="header">
                  <SearchForm onMovieSearch={this.onMovieSearch} />
                </Header>
                <Content className="main">{error ? errorMessage : searchMovies}</Content>
                <Footer className="footer">{searchFooterContent}</Footer>
              </TabPane>
              <TabPane tab="Rated" key="Rated" onChange={() => {}}>
                <Content className="main">{error ? errorMessage : ratedMovies}</Content>
                <Footer className="footer">{ratedFooterContent}</Footer>
              </TabPane>
            </Tabs>
          </section>
        </Layout>
      </ErrorBoundary>
    );
  }
}

ReactDOM.render(<MoviesApp />, document.getElementById('moviesapp'));
