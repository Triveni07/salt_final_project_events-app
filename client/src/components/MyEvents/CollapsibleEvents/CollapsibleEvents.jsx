import React, { Component } from 'react';

import './CollapsibleEvents.scss';

class CollapsibleEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };

    this.toggleList = this.toggleList.bind(this);
  }

  toggleList() {
    const { collapsed } = this.state;
    this.setState({ collapsed: !collapsed });
  }

  /* eslint-disable */
  render() {
    const { children, title, length } = this.props;
    const { collapsed } = this.state;

    return (
      <div className={`event-list ${collapsed && 'event-list--collapsed'}`}>
        <header className="event-list-header" onClick={this.toggleList}> 
          <h4>{title} ({length})</h4>
          <i className="fas arrow fa-angle-down" />
        </header>
        <div className="event-list-events">
          { children }
        </div>
      </div>
    );
  }
}

export default CollapsibleEvents;
