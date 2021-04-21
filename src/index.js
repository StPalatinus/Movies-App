import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Spin, Alert, Tabs } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
import MoviesList from './components/movies-list';
import FooterContent from './components/footer-content';
import mapiService from './services/mapi-service';
import ErrorScreen from './components/error-screen';

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
      moviesCount: 20,
      ratedMoviesCount: 20,
      loading: false,
      error: false,
      errMessage: null,
      errDescription: null,
      currentMovie: 'reted',
      sessionID: null,
      componentHasError: false,
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
      let movies;
      let page;
      let moviesCount;

      this.setState(() => ({
        loading: true,
        currentMovie: movieTosearch,
        selectedPage: pageNum,
        error: false,
      }));

      try {
        const baseResponse = await mapiService.getMovie(movieTosearch, pageNum);
        const { responseStatus } = baseResponse;
        movies = baseResponse.results;
        page = baseResponse.page;
        moviesCount = baseResponse.totalPages;

        if (responseStatus === 200 && movies.length === 0) {
          this.onError('Base error', 'Could not found requested resource');
        }
      } catch (err) {
        this.onError('Network Error', 'Could not receive data from server');
      }

      this.setState(() => ({
        moviesList: movies,
        loading: false,
        selectedPage: page,
        moviesCount,
      }));
    };

    this.getTopRated = async (movieTosearch, pageNum) => {
      let movies;
      let page;
      let moviesCount;

      this.setState(() => ({
        loading: true,
        currentMovie: movieTosearch,
        selectedPage: pageNum,
      }));

      try {
        const baseResponse = await mapiService.getTopRated(movieTosearch, pageNum);
        movies = baseResponse.results;
        page = baseResponse.page;
        moviesCount = baseResponse.totalPages;
      } catch (err) {
        this.onError('Network Error', 'Could not receive data from server');
      }

      this.setState(() => ({
        moviesList: movies,
        loading: false,
        selectedPage: page,
        moviesCount,
        currentMovie: movieTosearch,
      }));
    };

    this.getGenreConfig = async () => {
      try {
        await mapiService.downloadGenreConfig();
      } catch (err) {
        this.onError(err, 'Network Error', "Can't get genre config");
      }
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
        this.onError(err, 'Error', "Can't get session ID");
      }

      this.setState(() => ({
        sessionID: guestsessionID,
      }));

      return guestsessionID;
    };

    this.getUserRatedMovies = async () => {
      const timerId = setInterval(async () => {
        if (this.state.sessionID) {
          clearInterval(timerId);
          let movies;
          let page;
          let moviesCount;

          this.setState(() => ({
            loading: true,
            //   selectedRatedPage: pageNum,
          }));

          try {
            const baseResponse = await mapiService.getUserRatedMovies(this.state.sessionID);
            movies = baseResponse.results;
            moviesCount = baseResponse.totalPages;
            page = baseResponse.page;
          } catch (err) {
            this.onError('Network Error', 'Could not receive data from server');
          }

          this.setState(() => ({
            ratedList: movies,
            loading: false,
            selectedRatedPage: page,
            ratedMoviesCount: moviesCount,
          }));
        }
      }, 100);
    };
  }

  componentDidMount() {
    this.getGenreConfig();
    this.getTopRated();
    this.getsessionID();
    this.getUserRatedMovies();
  }

  componentDidUpdate() {
    const debouncedGetMovie = debounce(this.getMovie, 150, {
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

  componentDidCatch() {
    this.setState({ componentHasError: true });
  }

  render() {
    if (this.state.componentHasError) {
      return <ErrorScreen />;
    }

    // console.log(this.state.sessionID);
    const { loading, error, errMessage, errDescription } = this.state;

    const hasData = !(loading || error);

    const errorMessage = error ? <Alert message={errMessage} description={errDescription} type="error" /> : null;
    const spinner = loading ? (
      <div className="spin-wraper">
        <Spin />
      </div>
    ) : null;

    const content = hasData ? (
      <MoviesList
        moviesList={this.state.moviesList}
        onError={this.onError}
        ratededList={this.state.ratedList}
        sessionID={this.state.sessionID}
        getUserRatedMovies={this.getUserRatedMovies}
      />
    ) : null;
    const ratedMovies = hasData ? (
      <MoviesList
        moviesList={this.state.ratedList}
        onError={this.onError}
        sessionID={this.state.sessionID}
        getUserRatedMovies={this.getUserRatedMovies}
      />
    ) : null;

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
      <Layout id="appbody">
        <section className="header-section">
          <Tabs className="chose-display-variant" defaultActiveKey="2" centered onChange={() => {}}>
            <TabPane tab="Search" key="1">
              <Header className="header">
                <form className="header__search-form" onSubmit={this.onMovieSearch}>
                  <input
                    className="header__search-form--search-field"
                    placeholder="type to search..."
                    onChange={this.onMovieSearch}
                  />
                </form>
              </Header>
              <Content className="main">
                {errorMessage}
                {spinner}
                {content}
              </Content>
              <Footer>{searchFooterContent}</Footer>
            </TabPane>
            <TabPane tab="Rated" key="2">
              <Content className="main">
                {errorMessage}
                {spinner}
                {ratedMovies}
              </Content>
              <Footer>{ratedFooterContent}</Footer>
            </TabPane>
          </Tabs>
        </section>
      </Layout>
    );
  }
}

ReactDOM.render(<MoviesApp />, document.getElementById('moviesapp'));
