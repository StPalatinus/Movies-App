import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import './footer.css';

class Footer extends React.Component {  

  constructor(props) {
    super(props);

    const { moviesCount, moviesPerPage, selectedPage } = this.props;
    let receivedPages;
    if (moviesCount === 0) {
      receivedPages = 1;
    } else {
      receivedPages = Math.ceil(moviesCount / moviesPerPage);
    }
    
    console.log(`TEST: ${  receivedPages}`);


    Footer.defaultProps = {
      moviesCount: 6,
      moviesPerPage: 6,
      selectedPage: 1,
    };

    this.state = {
      pagesCount: receivedPages,
      moviesPerPage: 6,
      selectedPage,
    }
  }

  render() {

    const PagesList = () => {
      const list = [];
      for (let i = 0; i < this.state.pagesCount; i++) {

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

    console.log(this.state.pagesCount);
    console.log(this.state.moviesPerPage);
    const lt = "<";
    const gt =" >"

    return (
      <footer className="footer">
        <button type="button" className="previous" aria-label="Previous">{ lt }</button>
        <ul className="pagination">
          <PagesList />
          {/* <li className="pagination__item">
            <button type="button" className="pagination__button selected">1</button>
          </li>
          <li className="pagination__item">
            <button type="button" className="pagination__button">2</button>
          </li>
          <li className="pagination__item">
            <button type="button" className="pagination__button">3</button>
          </li>
          <li className="pagination__item">
            <button type="button" className="pagination__button">4</button>
          </li>
          <li className="pagination__item">
            <button type="button" className="pagination__button">5</button>
          </li> */}
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
