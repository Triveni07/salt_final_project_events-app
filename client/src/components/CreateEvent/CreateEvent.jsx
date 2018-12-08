import React, { Component } from 'react';
import {
  Select, MenuItem, TextField, Button, Checkbox, FormControlLabel,
} from '@material-ui/core';
import propTypes from 'prop-types';
import Compress from 'client-compress';

import LocationInput from './LocationInput/LocationInput';
import './CreateEvent.scss';
import onSubmitForm from './createEventFunctions';


class CreateEvent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      category: 'Party',
      labels: {
        title: 'Title',
        description: 'Description',
      },
      errors: {
        title: false,
        description: false,
      },
      location: {},
      image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d14a810136c7528ba19f04ff77b8130d&auto=format&f',
    };
    this.updateSelect = this.updateSelect.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  componentDidMount() {
    const options = {
      targetSize: 0.2,
      quality: 0.75,
      maxWidth: 800,
      maxHeight: 600,
    };

    const compress = new Compress(options);
    const upload = document.getElementById('upload');

    upload.addEventListener(
      'change',
      (evt) => {
        const files = [...evt.target.files];
        compress.compress(files).then((conversions) => {
          const { photo } = conversions[0];

          const base = Compress.blobToBase64(photo.data);
          base
            .then(data => this.fileUpload({ base64: data.toString() }));

        });
      },
      false,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  handleSubmit(e) {
    e.preventDefault();
    const { history } = this.props;
    const { location, image } = this.state;

    onSubmitForm(e, location, image);
    history.push('/');
  }

  updateSelect(e) {
    const category = e.currentTarget.getAttribute('data-value');
    this.setState(prevState => ({ ...prevState, category }));
  }

  fileUpload({ base64 }) {
    this.setState(prevState => ({ ...prevState, image: base64 }));
  }

  render() {
    const {
      category,
      errors,
      labels,
      image,
    } = this.state;
    const backgroundImage = `url(${image})`;
    const getDate = (days) => {
      const [date] = new Date(Date.now() + 1000 * 60 * 60 * 24 * days).toISOString().split(/:[\d.]+Z/);
      return date;
    };

    const startDate = getDate(7);
    const endDate = getDate(7);

    return (
      <div className="cre-bg">
        <div className="cre-modal">
          <div className="cre-modal-container">
            <form className="cre-form" onSubmit={e => this.handleSubmit(e)}>
              <div className="file-upload" style={{ backgroundImage }}>
                <input type="file" id="upload" />
                {image === 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d14a810136c7528ba19f04ff77b8130d&auto=format&f' && (
                  <div className="file-upload-cta">
                    <i className="fas fa-camera-retro" />
                  </div>
                )}
              </div>
              <TextField
                fullWidth
                className="cre-setting"
                label={labels.title}
                variant="outlined"
                id="title"
                error={errors.title}
                onSelect={(e) => {
                  const { length } = e.target.value;

                  const errorShort = length < 4;
                  const errorLong = length > 20;
                  const error = errorShort || errorLong;

                  let label = 'Title';

                  if (errorShort) {
                    label = 'Too short';
                  } else if (errorLong) {
                    label = 'Too long';
                  }

                  errors.title = error;
                  labels.title = label;

                  this.setState(prevState => ({ ...prevState, errors, labels }));
                }}
                required
              />
              <br />
              <Select
                id="category"
                className="cre-setting"
                value={category}
                onChange={this.updateSelect}
              >
                <MenuItem value="Party">Party</MenuItem>
                <MenuItem value="Music">Music</MenuItem>
                <MenuItem value="Family">Family</MenuItem>
              </Select>
              <br />
              <TextField
                required
                id="start-date"
                label="Start date"
                type="datetime-local"
                defaultValue={startDate}
                className="textField"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <br />
              <br />
              <TextField
                required
                id="end-date"
                label="End date"
                type="datetime-local"
                defaultValue={endDate}
                className="textField"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <br />
              <br />
              <LocationInput
                onChange={location => this.setState(prevState => ({ ...prevState, location }))}
              />
              <br />
              <TextField
                fullWidth
                className="cre-setting"
                label={labels.description}
                variant="outlined"
                id="description"
                error={errors.description}
                onSelect={(e) => {
                  const { length } = e.target.value;

                  const errorShort = length < 10;
                  const errorLong = length > 400;
                  const error = errorShort || errorLong;

                  let label = 'Description';

                  if (errorShort) {
                    label = 'Too short';
                  } else if (errorLong) {
                    label = 'Too long';
                  }

                  errors.description = error;
                  labels.description = label;

                  this.setState(prevState => ({ ...prevState, errors, labels }));
                }}
                required
                multiline
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox id="event-type" />
                }
                label="Public"
              />
              <FormControlLabel
                control={
                  <Checkbox id="event-type" />
                }
                label="Invite all my friends"
                checked
                disabled
              />
              <br />
              <div className="align-right">
                <Button variant="extendedFab" color="primary" type="submit">Create Event</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CreateEvent.propTypes = {
  history: propTypes.shape({}).isRequired,
};

export default CreateEvent;
