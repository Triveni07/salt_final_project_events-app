import React, { Component } from 'react';
import propTypes from 'prop-types';

import LoginModal from './LoginModal/LoginModal';
import './Navbar.scss';

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };

    this.closeModal = this.closeModal.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleOpen() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  render() {
    const { showModal } = this.state;
    const {
      login,
      logout,
      isLoggedIn,
      userName,
      navigate,
      history,
    } = this.props;
    const { pathname } = history.location;
    let publicBtn = 'nav-btn';
    let createBtn = 'nav-btn';
    let myBtn = 'nav-btn';

    switch (pathname) {
      case '/':
        publicBtn += ' nav-btn--selected';
        break;

      case '/create':
        createBtn += ' nav-btn--selected';
        break;

      case '/myevents':
        myBtn += ' nav-btn--selected';
        break;

      default:
        break;
    }

    return (
      <div className="navbar">
        <h1 className="logo">Chimera Events</h1>
        <div className="navbar-links">
          <button className={publicBtn} type="button" onClick={() => navigate('/')}>
            <i className="fas fa-th-large" />
            Public Events
          </button>
          {isLoggedIn && (
            <>
              <button className={myBtn} type="button" onClick={() => navigate('/myevents')}>
                <i className="fas fa-user" />
                My Events
              </button>
              <button className={createBtn} type="button" onClick={() => navigate('/create')}>
                <i className="fas fa-plus" />
                Create Event
              </button>
            </>
          )}
        </div>
        <div className="login-area">
          {
            isLoggedIn && (
              <h4 className="user-name">
                <i className="fas fa-user" />
                {userName}
              </h4>
            )
          }
          {isLoggedIn
            ? <button className="logout-btn" type="button" color="secondary" onClick={logout}>Logout</button>
            : <button className="login-btn nav-btn--selected nav-btn" type="button" onClick={this.handleOpen}>Login</button>
          }
        </div>
        <LoginModal showModal={showModal} login={login} closeModal={this.closeModal} />
      </div>
    );
  }
}

Navbar.propTypes = {
  login: propTypes.func.isRequired,
  isLoggedIn: propTypes.bool.isRequired,
  logout: propTypes.func.isRequired,
  navigate: propTypes.func.isRequired,
  userName: propTypes.string.isRequired,
  history: propTypes.shape({}).isRequired,
};
