import axios from 'axios';
import validate from './validation';

function onSubmitForm(e, locationData, picture) {
  const { target } = e;

  const title = target.querySelector('#title').value;
  const description = target.querySelector('#description').value;
  const category = target.querySelector('#category').value;
  const startDate = target.querySelector('#start-date').value;
  const endDate = target.querySelector('#end-date').value;

  const date = {
    start: startDate,
    end: endDate,
  };

  const location = {
    address: locationData.name,
    coordinates: {
      lat: locationData.latlng.lat,
      lng: locationData.latlng.lng,
    },
  };

  const publicBool = target.querySelector('#event-type').checked;
  console.log('sending picture: ', picture);
  const details = {
    title,
    description,
    category,
    date,
    location,
    picture,
    public: publicBool,
  };

  const validInput = validate(details);

  if (validInput) {
    console.log(details);
    // call to api
    axios.post('/api/event/create', { ...details })
      .then(() => {
        console.log('New event created');
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  }

}


export default onSubmitForm;
