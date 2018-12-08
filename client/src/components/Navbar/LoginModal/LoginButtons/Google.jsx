import React from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

const responseGoogle = (response, props) => {
  axios.post('/api/user/login', {
    platform: 'google',
    token: response.accessToken,
    ignoreCookie: JSON.parse(localStorage.getItem('ignoreCookie')),
  })
    .then((user) => {
      props.closeModal();
      props.login(user.data);
    });
};

const Google = props => (
  <GoogleLogin
    clientId="578734164648-rsbnudtce90t2v1at6nmajmq9qbd7jjq.apps.googleusercontent.com"
    buttonText="Login with Google"
    onSuccess={response => responseGoogle(response, props)}
    onFailure={responseGoogle}
  />
);

export default Google;
