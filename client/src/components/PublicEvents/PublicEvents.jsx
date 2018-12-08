import React, { Component } from 'react';
import axios from 'axios';

import EventCard from '../EventCard/EventCard';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import SmallMap from '../EventModal/SmallMap/SmallMap';
import { UserContext } from '../UserContextWrapper/UserContextWrapper';
import './PublicEvents.scss';

export default class PublicEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      category: '',
    };
  }

  componentDidMount() {
    const { category } = this.state;
    axios.get(`/api/event/public${category}`)
      .then(res => this.setState(prevState => ({ ...prevState, events: res.data })));
  }

  render() {
    let { events } = this.state;
    const { category } = this.state;
    const locations = events
      .map(event => event.location.coordinates)
      .map(c => ({ lng: Number(c.lng), lat: Number(c.lat) }));

    if (category) {
      events = events.filter(event => event.category.toUpperCase() === category);
    }

    /* eslint-disable */
    return (
      <div className="container">
        <CategoryFilter
          callback={newCategory => this.setState(prevState => (
            { ...prevState, category: newCategory }
          ))
          }
        />
        <div className="public-events">
          {events.map(data => (
            <UserContext.Consumer key={data._id}>
              {value => <EventCard event={data} user={value} />}
            </UserContext.Consumer>
          ))}
          { category === 'MAP' && (
            <span className="public-map">
              <SmallMap locations={locations} />
            </span>
          )}
        </div>
      </div>
    );
  }
}
