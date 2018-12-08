import React from 'react';
import propTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

import Facebook from './LoginButtons/Facebook';
import Google from './LoginButtons/Google';
import './LoginModal.scss';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

const LoginModal = (props) => {

  const {
    classes, showModal, onClose, login, closeModal,
  } = props;
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={showModal}
        onClose={onClose}
        onClick={({ target }) => {
          if (!target.classList.contains('login-modal')) closeModal();
        }}
      >
        <div style={getModalStyle()} className={`${classes.paper} login-modal`}>
          <Facebook login={login} />
          <Google closeModal={closeModal} login={login} />
        </div>
      </Modal>
    </div>
  );
};

/* eslint-disable */
LoginModal.propTypes = {
  classes: propTypes.shape({}).isRequired,
  onClose: propTypes.func,
  showModal: propTypes.bool.isRequired,
  login: propTypes.func.isRequired,
  closeModal: propTypes.func.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
export default withStyles(styles)(LoginModal);
