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
          <TabPane tab="Search" key="1">
            {/* Content of Tab Pane 1 */}
          </TabPane>
          <TabPane tab="Rated" key="2">
            {/* Content of Tab Pane 2 */}
          </TabPane>
        </Tabs>
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
