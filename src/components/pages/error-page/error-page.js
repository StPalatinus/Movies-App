import React from 'react';
import background from './terminator-genisys-error-background.jpg';

import './error-page.css';

export default class ErrorPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate() {}

  render() {
    const TestComponent = (
      <div className="error">
        <img className="error--image" src={background} alt="logo" />
        <div className="error--text">
          <div className="error--text_line">SOME ERROR OCCURRED</div>
          <div className="error--text_line">AND PAGE WAS TERMINATED</div>
          <div className="error--text_line">
            IF YOU CONTINUOUSLY GET THIS MESSAGE, PLEASE CONTACT SITE ADMINISTRATOR
          </div>
        </div>
      </div>
    );

    return <div>{TestComponent}</div>;
  }
}
