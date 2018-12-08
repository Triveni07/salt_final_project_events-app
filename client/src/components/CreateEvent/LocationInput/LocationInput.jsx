import React, { Component } from 'react';
import propTypes from 'prop-types';
import places from 'places.js';

import { placesAppId, placesAppKey } from '../../../config/secrets';
import './LocationInput.scss';


class LocationInput extends Component {
  componentDidMount() {

    const placesAutocomplete = places({
      appId: placesAppId,
      apiKey: placesAppKey,
      container: document.querySelector('#address-input'),
      countries: ['se'],
      type: 'address',
    });

    const { onChange } = this.props;
    placesAutocomplete.on('change', (e) => {
      onChange(e.suggestion);
    }, 50);
  }

  render() {
    return <input type="search" id="address-input" placeholder="Event address" />;
  }
}

LocationInput.propTypes = {
  onChange: propTypes.func.isRequired,
};

export default LocationInput;
