import React from 'react';
import { Route, Switch } from 'react-router-dom';
import propTypes from 'prop-types';

// Component Imports
import Navbar from '../Navbar/Navbar';
import PublicEvents from '../PublicEvents/PublicEvents';
import CreateEvent from '../CreateEvent/CreateEvent';
import MyEvents from '../MyEvents/MyEvents';
import UserContextWrapper, { UserContext } from '../UserContextWrapper/UserContextWrapper';

import './Main.scss';

const Main = (props) => {
  const { history } = props;

  return (
    <UserContextWrapper history={history}>
      <UserContext.Consumer>
        {value => (
          <Navbar
            history={history}
            login={value.login}
            logout={value.logout}
            isLoggedIn={value.isLoggedIn}
            userName={value.credentials.userName}
            navigate={path => history.push(path)}
          />
        )}
      </UserContext.Consumer>

      <div className="content-container">
        <div className="background" />
        <div className="content">
          <Switch>
            <Route exact path="/" component={PublicEvents} />
            <Route exact path="/create" component={CreateEvent} />
            <Route exact path="/myevents" component={MyEvents} />
            <Route path="*" render={() => <h1>404</h1>} />
          </Switch>
        </div>
      </div>
    </UserContextWrapper>
  );
};

Main.propTypes = {
  history: propTypes.shape({}).isRequired,
};

export default Main;
