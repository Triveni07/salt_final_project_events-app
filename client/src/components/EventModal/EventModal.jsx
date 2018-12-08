import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import propTypes from 'prop-types';
import moment from 'moment';

import SmallMap from './SmallMap/SmallMap';
import AttendButton from './AttendButton/AttendButton';
import './EventModal.scss';

export default class EventModal extends Component {

  constructor(props) {
    super(props);


    const { closeModal, user } = this.props;
    this.close = () => {
      closeModal();
      user.updateCredentials();
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleClick(e) {
    if (e.target.classList.contains('modal-bg')) {
      this.close();
    }
  }

  handleKeyDown(e) {
    if (e.key === 'Escape') this.close();
  }

  /* eslint-disable */
  render() {
    const { event, user } = this.props;
    const userIsAttending = user.credentials.events.attending.includes(event._id);

    const { coordinates } = event.location;
    const locations = {
      lat: Number(coordinates.lat),
      lng: Number(coordinates.lng),
    };

    let date = 'N/A';
    let time = 'N/A';
    if (event.date.start) {
      date = moment(event.date.start).format('MMM DD');
      time = moment(event.date.start).format('hh:mm');
    } else if(event.date.dateString) {
      date = event.date.dateString;
    }

    return (
      <div className="modal-bg" onClick={this.handleClick}>
        <div className="modal-container">
          {event.picture
            ? (
              <div className="event-image" style={{ backgroundImage: `url(${event.picture})` }}>
                <div className="event-profile-picture" />
              </div>
            )
            : (
              <div className="event-image">
                <h2 className="modal-event-title">{event.title}</h2>
                <div className="event-profile-picture" />
              </div>
            )
          }
          <div className="modal-info">



            <div className="modal-info-details">

              <div className="modal-info-detail">
                <i className="fas fa-user"></i>
                <h4>{event.createdBy.name}</h4>
                <span className="info-label">Organizer</span>
              </div>

              <div className="modal-info-detail">
                <i className="fas fa-bookmark"></i>
                <h4>{event.category}</h4>
                <span className="info-label">Category</span>
              </div>

              <div className="modal-info-detail">
                <i className="fas fa-map-marker-alt"></i>
                <h4>{event.location.address}</h4>
                <span className="info-label">Location</span>
              </div>

              <div className="modal-info-detail">
                <i className="fas fa-calendar"></i>
                <h4>{date}</h4>
                <span className="info-label">Date</span>
              </div>

              <div className="modal-info-detail">
                <i className="fas fa-clock"></i>
                <h4>{time}</h4>
                <span className="info-label">Time</span>
              </div>

              <div className="modal-info-detail">
                <i className="fas fa-users"></i>
                <h4>{event.attending.length}</h4>
                <span className="info-label">Attending</span>
              </div>


              <div className="modal-info-detail">
                <i className="fas fa-align-left"></i>
                <h4>{event.description}</h4>
                <span className="info-label">Description</span>
              </div>
            </div>

            <div className="modal-map">
              <SmallMap locations={[locations]} />
            </div>
            <div className="event-actions">
              <div className="event-actions">
                <Button variant="contained" onClick={this.close}>Close</Button>
                <AttendButton 
                  userIsAttending={userIsAttending}
                  id={event._id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EventModal.propTypes = {
  closeModal: propTypes.func.isRequired,
  event: propTypes.shape({}).isRequired,
  user: propTypes.shape({}).isRequired,
};
