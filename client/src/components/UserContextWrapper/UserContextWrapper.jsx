import React, { Component } from 'react';
import propTypes from 'prop-types';
import axios from 'axios';

export const UserContext = React.createContext();

class UserContextWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      ignoreCookie: JSON.parse(localStorage.getItem('ignoreCookie')),
      credentials: {
        userName: '',
        events: {
          attending: [],
        },
        friends: {
          incoming: [],
          outgoing: [],
          accepted: [],
        },
      },
      login: this.login.bind(this),
      logout: this.logout.bind(this),
      updateEvent: this.updateEvent.bind(this),
      updateCredentials: this.updateCredentials.bind(this),
    };
  }

  componentDidMount() {
    const { ignoreCookie } = this.state;
    const hasCookie = document.cookie.includes('chimera_cookie');
    if (hasCookie && !ignoreCookie) {
      axios.get('/api/user/me')
        .then(res => this.login(res.data));
    }
  }

  updateCredentials() {
    axios.get('/api/user/me')
      .then((res) => {
        if (res.data) {
          this.setState(prevState => ({ ...prevState, credentials: res.data }));
        }
      })
      .catch(() => console.log('user not logged in'));
  }

  updateEvent(eventId) {
    const { credentials } = this.state;
    let { attending } = credentials.events;

    if (attending.includes(eventId)) {
      attending = attending.filter(id => id !== eventId);
    } else {
      attending.push(eventId);
    }

    this.setState(prevState => ({
      ...prevState,
      credentials: {
        ...prevState.credentials,
        events: { ...prevState.credentials.events, attending },
      },
    }));
  }

  login(credentials) {
    localStorage.setItem('ignoreCookie', 'false');
    this.setState({ isLoggedIn: true, credentials, ignoreCookie: false });
  }

  logout() {
    localStorage.setItem('ignoreCookie', 'true');
    this.setState(prevState => ({ ...prevState, isLoggedIn: false, ignoreCookie: true }));
  }

  render() {
    const { history, children } = this.props;
    const { isLoggedIn } = this.state;
    const { pathname } = history.location;

    const lockedPaths = ['/create'];
    if (!isLoggedIn && lockedPaths.includes(pathname)) history.push('/');
    return (
      <UserContext.Provider value={this.state}>
        {children}
      </UserContext.Provider>
    );
  }
}

UserContextWrapper.propTypes = {
  children: propTypes.arrayOf(propTypes.element).isRequired,
  history: propTypes.shape({}).isRequired,
};

export default UserContextWrapper;
