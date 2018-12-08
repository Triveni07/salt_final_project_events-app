import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

import EventModal from '../EventModal/EventModal';
import './EventCard.scss';
/* eslint-disable */
class EventCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };

    this.closeModal = this.closeModal.bind(this);
    

  }

  attendEvent(id) {
    const { user } = this.props;
    user.updateEvent(id);
    axios.post(`/api/event/public/attend/${id}`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  expanded() {
    const { event, user } = this.props;
    const userIsAttending = user.credentials.events.attending.includes(event._id);
    const userIsCreator = user.credentials.events.created.includes(event._id);

    return (
      <div className="event-info event-info--expanded">
        <h4 className="event-info-category">{event.category}</h4>
        <h1 className="event-info-title">{event.title}</h1>
        <p className="event-info-description">{event.description}</p>
        <h4>{event.date.start}</h4>
        <EventAction userIsAttending={userIsAttending}
        eventId={event._id}/>
      </div>
    );
  }

  contracted() {
    const { event } = this.props;
    let date = event.date.start;
    
    if (event.createdBy.name !== 'Stockholm Stad' && event.date.start) {
      date = moment(event.date.start).format('MMM DD');
      window.date = date;
    } else if (event.date.dateString) {
      [date] = event.date.dateString.split('-');
    }

    return (
      <div onClick={() => this.setState(prevState => ({ expanded: !prevState.expanded }))}>
        {event.picture
          ? (
            <div className="event-image" style={{ backgroundImage: `url(${event.picture})` }}>
              <div className="event-profile-picture" />
            </div>)
          : (
            <div className="event-image">
              <div className="event-profile-picture" />
            </div>)
        }
        <div
          className="event-info event-info--contracted"
        >
          <h4 className="event-info-category">
            <i className="fas fa-bookmark"></i>{event.category}
            <i className="fas fa-users"></i>{event.attending ? event.attending.length : '0'}
            <i className="fas fa-calendar"></i>{date}
          </h4>
          <h1 className="event-info-title">{event.title}</h1>
        </div>
      </div>
    );
  }

  closeModal() {
    this.setState({ expanded: false });
  }

  render() {
    const { event, user } = this.props;
    const { expanded } = this.state;
    const className = `event-card category-${event.category} ${expanded ? 'event-card--expanded' : 'event-card--contracted'}`;
    /* eslint-disable */
    return (
      <div
        className={className}
        key={Math.random()}
      >

        {expanded && 
        <EventModal
        event={event} 
        closeModal={this.closeModal}
        user={user}
        />}
        {this.contracted()}
      </div>
    );
  }
}

EventCard.propTypes = {
  event: propTypes.shape({}).isRequired,
};

export default EventCard;
