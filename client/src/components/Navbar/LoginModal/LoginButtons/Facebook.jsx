import React from 'react';
import FacebookLogin from 'react-facebook-login';
import propTypes from 'prop-types';

const responseFacebook = (response, cb) => {
  const { name, userID, accessToken } = response;
  const user = {
    user_name: name,
    user_ID: userID,
    access_Token: accessToken,
  };

  cb(user);
};

const handleLogin = () => {

};

const Facebook = props => (
  <FacebookLogin
    appId="827178304339896"
    autoLoad={false}
    fields="name,email,picture"
    size="small"
    onClick={handleLogin}
    callback={response => responseFacebook(response, props.login)}
  />
);

Facebook.propTypes = {
  login: propTypes.func.isRequired,
};

export default Facebook;
