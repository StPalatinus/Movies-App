import React from 'react';
import PropTypes from 'prop-types';
import ErrorPage from '../pages/error-page';

import './error-boundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentHasError: false,
    };
  }

  componentDidCatch() {
    this.setState({ componentHasError: true });
  }

  render() {
    if (this.state.componentHasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default ErrorBoundary;
