import React, { Component } from 'react';
import axios from 'axios';

import './MyEvents.scss';
import CollapsibleList from './CollapsibleEvents/CollapsibleEvents';
import CompactCard from '../EventCard/CompactCard/CompactCard';
import FriendsPanel from '../FriendsPanel/FriendsPanel';
import { UserContext } from '../UserContextWrapper/UserContextWrapper';

class MyEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: {
        created: [],
        attending: [],
        invites: [],
      },
    };
  }

  componentDidMount() {
    axios.get('/api/event/myevents')
      .then(res => this.setState({ events: res.data }));
  }

  render() {
    const { events } = this.state;
    const { attending, created, invites } = events;

    return (
      <div className="container">
        <div className="profile">
          <div className="my-events">
            <UserContext.Consumer>
              {value => (
                <CollapsibleList title="Event invites" length={invites.length}>
                  {invites.map(event => (
                    <CompactCard event={event} user={value} key={Math.round(Date.now() * Math.random())} />
                  ))}
                </CollapsibleList>
              )}
            </UserContext.Consumer>
            <UserContext.Consumer>
              {value => (
                <CollapsibleList title="Created events" length={created.length}>
                  {created.map(event => (
                    <CompactCard event={event} user={value} key={Math.round(Date.now() * Math.random())} />
                  ))}
                </CollapsibleList>
              )}
            </UserContext.Consumer>
            <UserContext.Consumer>
              {value => (
                <CollapsibleList title="Upcoming events" length={attending.length}>
                  {attending.map(event => (
                    <CompactCard event={event} user={value} key={Math.round(Date.now() * Math.random())} />
                  ))}
                </CollapsibleList>
              )}
            </UserContext.Consumer>
          </div>
          <div className="my-friends">
            <FriendsPanel />
          </div>
        </div>
      </div>
    );
  }
}

export default MyEvents;
