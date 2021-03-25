import React from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames/bind';
import { Pagination } from 'antd';
// import 'antd/dist/antd.css';

import './footer-content.css';

class FooterContent extends React.Component {
  constructor(props) {
    super(props);

    const { selectedPage } = this.props;

    FooterContent.defaultProps = {
      moviesCount: 6,
      moviesPerPage: 6,
      selectedPage: 1,
    };

    this.state = {
      selectedPage,
    };

    this.changePag = (evt) => {
      this.setState(() => ({
        selectedPage: evt,
      }));
    };
  }

  render() {
    const { moviesPerPage, moviesCount } = this.props;

    return (
      <footer className="footer">
        <div>
          <Pagination
            onChange={this.changePag}
            total={moviesCount}
            current={this.state.selectedPage}
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
};

export default FooterContent;
