import React from 'react';
// import PropTypes from 'prop-types';

import './footer.css';

class Header extends React.Component {
  // constructor(props) {
  //   super(props);

  // }

  render() {

    const lt = "<";
    const gt =" >"

    return (
      <footer className="footer">
        <button type="button" className="previous" aria-label="Previous">{ lt }</button>
        <ul className="pagination">
          <li className="pagination__item">
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
          </li>
        </ul>
        <button type="button" className="next" aria-label="Next">{ gt }</button>
      </footer>
    );
  }
}

// Header.propTypes = {
  
// };

export default Header;
