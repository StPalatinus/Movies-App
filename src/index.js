import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Spin, Alert, Tabs } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
// import HeaderContent from './components/header-content';
import MoviesList from './components/movies-list';
import FooterContent from './components/footer-content';
import mapiService from './services/mapi-service';
import RatedMovies from './components/rated-movies';

const debounce = require('lodash.debounce');

const { TabPane } = Tabs;

// import './components/header-content/header-content.css'
// import './components/footer-content/footer-content.css'

const { Header, Footer, Content } = Layout;

class MoviesApp extends React.Component {
  constructor() {
    super();

    this.state = {
      moviesList: [],
      ratedList: [],
      selectedPage: 1,
      moviesCount: 20,
      loading: false,
      error: false,
      errMessage: null,
      errDescription: null,
      currentMovie: 'reted',
      sessionID: '0',
    };

    this.onError = (errMessage, errDescription) => {
      // console.log(`ERROR!${err}`);
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
          // console.log(responseStatus);
          // console.log(movies.length);
          this.onError('Base error', 'Could not found requested resource');
        }

        // console.log(movies);
      } catch (err) {
        this.onError('Network Error', 'Could not receive data from server');
      }

      this.setState(() => ({
        moviesList: movies,
        loading: false,
        selectedPage: page,
        moviesCount,
        // currentMovie: movieTosearch,
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

    // this.setPage = (page) => {
    //   console.log(page);
    // };

    this.changePage = (page) => {
      this.getMovie(this.state.currentMovie, page);
      this.setState(() => ({
        selectedPage: page,
      }));
    };

    this.getsessionID = async () => {
      const guestsessionID = await mapiService.getGuestsessionID();

      // console.log(guestsessionID);

      this.setState(() => ({
        sessionID: guestsessionID,
      }));

      return guestsessionID;
    };

    // this.getUserRatedMovies = async (pageNum) => {
    this.getUserRatedMovies = async (sessionId) => {
      console.log(`sessionId = ${sessionId}`);
      // let movies;
      // let page;
      // let moviesCount;

      // this.setState(() => ({
      //   // loading: true,
      // //   selectedRatedPage: pageNum,
      // }));

      try {
        // const baseResponse = await mapiService.getTopRated(pageNum);
        const baseResponse = await mapiService.getUserRatedMovies(sessionId);
        console.log(baseResponse);
        // movies = baseResponse.results;
        // page = baseResponse.page;
        // moviesCount = baseResponse.totalPages;
      } catch (err) {
        this.onError('Network Error', 'Could not receive data from server');
      }

      // this.setState(() => ({
      //   ratedList: movies,
      //   loading: false,
      // //   selectedRatedPage: page,
      // //   ratedCount,
      // }));
    };
  }

  componentDidMount() {
    this.getGenreConfig();
    this.getTopRated();
    this.getsessionID();
    // this.getUserRatedMovies(this.state.sessionID);
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

  render() {
    const { loading, error, errMessage, errDescription } = this.state;

    const hasData = !(loading || error);

    const errorMessage = error ? <Alert message={errMessage} description={errDescription} type="error" /> : null;
    const spinner = loading ? (
      <div className="spin-wraper">
        <Spin />
      </div>
    ) : null;

    const content = hasData ? (
      <MoviesList moviesList={this.state.moviesList} onError={this.onError} sessionID={this.state.sessionID} />
    ) : null;
    const ratedMovies = hasData ? (
      <MoviesList
        moviesList={this.state.ratedList}
        onError={this.onError}
        sessionID={this.state.sessionID}
        getUserRatedMovies={this.getUserRatedMovies}
      />
    ) : null;

    const footerContent = error ? (
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
              <Footer>{footerContent}</Footer>
            </TabPane>
            <TabPane tab="Rated" key="2">
              <RatedMovies
                sessionID={this.state.sessionID}
                getsessionID={this.getsessionID}
                getUserRatedMovies={this.getUserRatedMovies}
              />
              <Content className="main">
                {errorMessage}
                {spinner}
                {ratedMovies}
              </Content>
              <Footer>{footerContent}</Footer>
            </TabPane>
          </Tabs>
        </section>
      </Layout>
    );
  }
}

ReactDOM.render(<MoviesApp />, document.getElementById('moviesapp'));
