import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './components/header';
import MoviesList from './components/movies-list';
import Footer from './components/footer';

class MoviesApp extends React.Component {

  constructor() {
    super();

    this.state = {
      // footerText: "Footer Content",
    };
  }

  render() {

    // const footerContent = <div className="testClasss">{ this.state.footerText }</div>

    return (
      <section id="appbody">
        < Header />
        < MoviesList />
        < Footer />
      </section>
    );
  }
}

ReactDOM.render(<MoviesApp />, document.getElementById('moviesapp'));
