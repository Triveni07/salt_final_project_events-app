import React, { Component } from 'react';
import propTypes from 'prop-types';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import EventModal from '../../EventModal/EventModal';

/* eslint-disable */
class CompactCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.closeModal = this.closeModal.bind(this);

  }

  // attendEvent(id) {
  //   const { user } = this.props;
  //   user.updateEvent(id);
  //   axios.post(`/api/event/public/attend/${id}`)
  //     .then(res => console.log(res))
  //     .catch(err => console.log(err));
  // }

  closeModal() {
    this.setState({ expanded: false });
  }

  contracted() {
    const { event } = this.props;
    let date = 'N/A';
    if (event.date.start) {
      date = moment(event.date.start).format('MMM DD');
    } else if (event.date.dateString) {
      [date] = event.date.dateString.split('-');
    }

    return (
      <>
        <h4 className="event-info-title">
          {event.title}
        </h4>
        <h4>
          {date}
        </h4>
        <Button variant="contained" color="primary" onClick={() => this.setState({ expanded: true })}>View</Button>
      </>
    );
  }

  render() {
    const { event, user } = this.props;
    const { expanded } = this.state;
    const className = `event-card event-card--compact category-${event.category}`;

    /* eslint-disable */
    return (
      <div
        className={className}
        key={Math.random()}
      >
        { expanded && <EventModal event={event} closeModal={this.closeModal} user={user}/> }
        { this.contracted() }
      </div>
    );
  }
}

CompactCard.propTypes = {
  event: propTypes.shape({}).isRequired,
};

export default CompactCard;
