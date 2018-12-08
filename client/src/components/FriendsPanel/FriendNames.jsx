import React, { Component } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';

import CompactCard from '../EventCard/CompactCard/CompactCard';

class FriendNames extends Component {

  constructor(params) {
    super(params);
    const { id } = this.props;
    this.id = id;
    this.state = {
      name: '',
      collapsed: true,
      attending: [],
    };

    this.toggleList = this.toggleList.bind(this);
  }

  componentDidMount() {
    axios.get(`/api/user/name/${this.id}`)
      .then(res => this.setState(prevState => ({ ...prevState, name: res.data })))
      .catch(err => console.log(err));

    axios.get(`/api/event/attending/${this.id}`)
      .then(res => this.setState(prevState => ({ ...prevState, attending: res.data })))
      .catch(err => console.log(err));
  }

  toggleList() {
    this.setState(prevState => ({ ...prevState, collapsed: !prevState.collapsed }));
  }

  /* eslint-disable */
  render() {
    const { name, collapsed, attending } = this.state;
    const { user } = this.props;

    return (
      <div className={`friends event-list ${collapsed && 'event-list--collapsed'}`}>
        <header className="event-list-header" onClick={this.toggleList}> 
          <h4>
            <i className="fas fa-user"></i>
            {name} ({attending.length})
          </h4>
          <i className="fas fa-angle-down" />
        </header>
        <div className="event-list-events">
        { !collapsed && attending.map(evt => <CompactCard event={evt} user={user} key={Math.round(Date.now() * Math.random())} />) }
        </div>
      </div>
    );
  }
}

FriendNames.propTypes = {
  id: propTypes.string.isRequired,
  user: propTypes.shape({}).isRequired,
};

export default FriendNames;
