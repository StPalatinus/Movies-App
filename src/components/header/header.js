import React from 'react';
import PropTypes from 'prop-types';

import './header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);

    const { searchMovie } = this.props;

    Header.defaultProps = {
      
    }

    this.onMovieSearch = (evt) => {
      evt.preventDefault();
      searchMovie(evt.target.firstChild.value);
    }
  }

  render() {

    return (
      <header className="header">
          <ul className="chose-display-variant">
            <li className="chose-display-variant-item">
              <button className="chose-display-variant-button selected" type="button">
                Search
              </button>
            </li>
            <li className="chose-display-variant-item">
              <button className="chose-display-variant-button" type="button">
                Rated
              </button>
            </li>
          </ul>
          <form className="header__search-form" onSubmit={this.onMovieSearch}>
          <input 
            className="header__search-form--search-field"
            placeholder="type to search..."
            onChange={() => console.log("Something changed")} />
        </form>
      </header>
    );
  }
}

Header.propTypes = {
  searchMovie: PropTypes.func.isRequired,
}

// Header.propTypes = {
  
// };

export default Header;
