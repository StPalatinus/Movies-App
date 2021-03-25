import React from 'react';
import ReactDOM from 'react-dom';
import { Layout } from 'antd';
import 'antd/dist/antd.css';

import './index.css';
import HeaderContent from './components/header-content';
import MoviesList from './components/movies-list';
import FooterContent from './components/footer-content';
import mapiService from './services/mapi-service';

// import './components/header-content/header-content.css'
// import './components/footer-content/footer-content.css'

const { Header, Footer, Content } = Layout;

class MoviesApp extends React.Component {
  constructor() {
    super();

    this.state = {
      moviesList: [],
      selectedPage: 1,
    };

    this.getMovie = async (movieTosearch) => {
      const movies = await mapiService.getMovie(movieTosearch);

      this.setState(() => ({
        moviesList: movies,
      }));
    };
  }

  componentDidMount() {
    const recievedGenres = mapiService.downloadGenreConfig();
    console.log(recievedGenres);

    // const tra = mapiService.getLocalGenreConfig();
    // console.log(tra);

    // recievedGenres.then((result) => console.log(result));

    // const ava = ( async () => {
    //   const recievedGenres = await mapiService.renewGenreConfig();
    //   return recievedGenres;
    // })();

    // ava.then((result) => console.log(result));
  }

  render() {
    return (
      <Layout id="appbody">
        <Header className="header">
          <HeaderContent getMovie={this.getMovie} />
        </Header>
        <Content className="main">
          <MoviesList moviesList={this.state.moviesList} />
        </Content>
        <Footer>
          <FooterContent
            moviesCount={this.state.moviesList.length}
            moviesPerPage={6}
            selectedPage={this.state.selectedPage}
          />
        </Footer>
      </Layout>
    );
  }
}

ReactDOM.render(<MoviesApp />, document.getElementById('moviesapp'));
