import React from 'react';
import PropTypes from 'prop-types';
// import format from 'date-fns/format';
// import { ru } from 'date-fns/locale';
import 'antd/dist/antd.css';
// import { Image, Tag } from 'antd';

// import mapiService from '../../services/mapi-service';

import './rated-movies.css';

export default class RatedMovies extends React.Component {
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
    const TestComponent = <div>{`RATED MOVIES HERE! ${this.props.sessionID}`}</div>;

    return (
      <div>{TestComponent}</div>
      // <div>`RATED MOVIES HERE! ${test}`</div>
    );
  }
}

RatedMovies.propTypes = {
  sessionID: PropTypes.string.isRequired,
  // getsessionID: PropTypes.func.isRequired,
};
