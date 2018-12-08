import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Button } from '@material-ui/core';
import axios from 'axios';

class AttendButton extends Component {
  constructor(props) {
    super(props);

    const { userIsAttending, id } = this.props;
    this.state = {
      userIsAttending,
      id,
    };
  }

  attendEvent() {
    this.setState(prevState => ({ ...prevState, userIsAttending: !prevState.userIsAttending }));
    const { id } = this.state;

    axios.post(`/api/event/public/attend/${id}`)
      .then(res => console.log(res))
      .catch(err => console.log(err));

  }

  render() {
    const { userIsAttending } = this.state;

    return (
      <>
        {userIsAttending
          ? <Button variant="contained" color="secondary" onClick={() => this.attendEvent()}>Unattend</Button>
          : <Button variant="contained" color="primary" onClick={() => this.attendEvent()}>Attend</Button>
        }
      </>
    );
  }
}

AttendButton.propTypes = {
  userIsAttending: propTypes.bool.isRequired,
  id: propTypes.string.isRequired,
};

export default AttendButton;
