import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import 'antd/dist/antd.css';

import './search-form.css';
import ErrorBoundary from '../error-boundry';

export default class SearchForm extends React.Component {
  constructor() {
    super();

    SearchForm.defaultProps = {
      onMovieSearch: () => {},
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    return (
      <ErrorBoundary>
        <Form
          className="header__search-form"
          onSubmit={this.props.onMovieSearch}
          name="basic"
          initialValues={{
            message: 'type to search',
          }}
        >
          <Form.Item
            name="search"
            rules={[
              {
                // required: true,
                message: 'type to search',
              },
            ]}
          >
            <Input
              placeholder="type to search..."
              className="header__search-form--search-field"
              onChange={this.props.onMovieSearch}
            />
          </Form.Item>
        </Form>
      </ErrorBoundary>
    );
  }
}

SearchForm.propTypes = {
  onMovieSearch: PropTypes.func,
};
