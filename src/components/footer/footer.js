import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import './footer.css';

class Footer extends React.Component {  

  constructor(props) {
    super(props);

    const { selectedPage } = this.props;

    Footer.defaultProps = {
      moviesCount: 6,
      moviesPerPage: 6,
      selectedPage: 1,
    };

    this.state = {
      selectedPage,
    }
  }

  render() {

    let receivedPages;
    if (this.props.moviesCount === 0) {
      receivedPages = 1;
    } else {
      receivedPages = Math.ceil(this.props.moviesCount / this.props.moviesPerPage);
    }

    const PagesList = () => {
      const list = [];
      for (let i = 0; i < Math.ceil(receivedPages); i++) {
        const btnClass = classNames({
          'pagination__button': true,
          'selected': this.state.selectedPage === i + 1,
        });

        const element = 
          (<li id = {i} className="pagination__item">
            <button type="button" className={btnClass}>{i + 1}</button>
          </li>)
        list.push(element);
      }
      return list;
    }

    const lt = "<";
    const gt = ">"

    return (
      <footer className="footer">
        <button type="button" className="previous" aria-label="Previous">{ lt }</button>
        <ul className="pagination">
          <PagesList />
        </ul>
        <button type="button" className="next" aria-label="Next">{ gt }</button>
      </footer>
    );
  }
}

Footer.propTypes = {
  moviesCount: PropTypes.number,
  moviesPerPage: PropTypes.number,
  selectedPage: PropTypes.number,
};

export default Footer;
