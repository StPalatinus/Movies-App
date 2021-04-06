import React from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames/bind';
import { Pagination } from 'antd';
// import 'antd/dist/antd.css';

import './footer-content.css';

class FooterContent extends React.Component {
  constructor(props) {
    super(props);

    const { changePage } = this.props;

    FooterContent.defaultProps = {
      moviesCount: 6,
      moviesPerPage: 6,
      selectedPage: 1,
      changePage: () => {},
    };

    // this.state = {
    //   selectedPage,
    // };

    this.changePage = (page) => {
      // console.log(page);
      changePage(page);
    };
  }

  componentDidUpdate() {
    // const { getMovie, selectedPage } = this.props;
    // const searchField = document.querySelectorAll('.header__search-form--search-field');
    // console.log(getMovie);
    // console.log(selectedPage);
    // console.log(searchField);
  }

  render() {
    const { moviesPerPage, moviesCount, selectedPage } = this.props;

    return (
      <footer className="footer">
        <div>
          <Pagination
            onChange={this.changePage}
            total={moviesCount}
            current={selectedPage}
            defaultCurrent={1}
            defaultPageSize={moviesPerPage}
          />
        </div>
      </footer>
    );
  }
}

FooterContent.propTypes = {
  moviesCount: PropTypes.number,
  moviesPerPage: PropTypes.number,
  selectedPage: PropTypes.number,
  changePage: PropTypes.func,
  // getMovie: PropTypes.func.isRequired,
};

export default FooterContent;
