import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';

import './header-content.css';

const { TabPane } = Tabs;

class HeaderContent extends React.Component {
  constructor(props) {
    super(props);

    const { getMovie } = this.props;

    HeaderContent.defaultProps = {};

    this.onMovieSearch = (evt) => {
      evt.preventDefault();
      getMovie(evt.target.firstChild.value);
    };
  }

  render() {
    return (
      <section className="header-section">
        <Tabs className="chose-display-variant" defaultActiveKey="1" centered onChange={() => {}}>
          <TabPane tab="Tab 1" key="1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
        {/* <ul className="chose-display-variant">
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
        </ul> */}
        <form className="header__search-form" onSubmit={this.onMovieSearch}>
          <input
            className="header__search-form--search-field"
            placeholder="type to search..."
            onChange={() => console.log('Something changed')}
          />
        </form>
      </section>
    );
  }
}

HeaderContent.propTypes = {
  getMovie: PropTypes.func.isRequired,
};

// Header.propTypes = {

// };

export default HeaderContent;
