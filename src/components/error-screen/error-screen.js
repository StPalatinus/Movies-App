import React from 'react';
// import PropTypes from 'prop-types';
// import format from 'date-fns/format';
// import { ru } from 'date-fns/locale';
// import 'antd/dist/antd.css';
// import { Image, Tag } from 'antd';

// import mapiService from '../../services/mapi-service';
import background from './terminator-genisys-error-background.jpg';

import './error-screen.css';

export default class ErrorScreen extends React.Component {
  constructor(props) {
    super(props);

    // this.getsessionID = async ()=> {
    //   const guestsessionID = await mapiService.getGuestsessionID();

    //   // console.log(guestsessionID);

    //   this.setState (() => (
    //     {
    //       sessionID: guestsessionID,
    //     }
    //   ));

    //   return guestsessionID;
    //  }

    this.state = {
      // sessionID: this.props.sessionID,
    };
  }

  componentDidMount() {
    // this.props.getsessionID();
  }

  componentDidUpdate() {}

  render() {
    const TestComponent = (
      <div className="error">
        {/* <img  src={logo} style={style} alt="logo"/> */}
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

// ErrorScreen.propTypes = {

// };
