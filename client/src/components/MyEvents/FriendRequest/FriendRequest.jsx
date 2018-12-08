import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import Button from '@material-ui/core/Button';

class FriendRequest extends Component {
  constructor(props) {
    super(props);

    const { id, update } = this.props;
    this.id = id;
    this.update = update;

    this.state = {
      name: '',
    };

    this.accept = this.accept.bind(this);
    this.decline = this.decline.bind(this);
  }

  componentDidMount() {
    axios.get(`/api/user/name/${this.id}`)
      .then(res => this.setState({ name: res.data }));
  }

  accept() {
    axios.post('/api/user/friend/accept', { id: this.id })
      .then(() => this.update())
      .catch(err => console.log(err));
  }

  decline() {
    axios.post('/api/user/friend/decline', { id: this.id })
      .then(() => this.update())
      .catch(err => console.log(err));
  }

  render() {
    const { name } = this.state;

    return (
      <div>
        <h4>{name}</h4>
        <Button variant="contained" color="primary" onClick={this.accept}>Accept</Button>
        <Button variant="contained" color="secondary" onClick={this.decline}>Decline</Button>
      </div>
    );
  }
}

FriendRequest.propTypes = {
  id: propTypes.string.isRequired,
  update: propTypes.func.isRequired,
};

export default FriendRequest;
