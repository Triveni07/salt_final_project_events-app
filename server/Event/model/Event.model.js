const mongoose = require('mongoose');

const eventSchema = {
  attending: {
    type: Array,
    required: false,
    default: [],
  },
  createdBy: {
    name: {
      type: String,
      required: true,
      default: 'John Doe',
    },
    id: {
      type: String,
      required: true,
    }
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    start: {
      type: Date,
      required: false,
    },
    end: {
      type: Date,
      required: false
    },
    dateString: {
      type: String,
      required: false
    }
  },
  description: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
    default: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d14a810136c7528ba19f04ff77b8130d&auto=format&f',
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: false,
    },
    coordinates: { // Defaults to Sergels Torg
      lat: {
        type: String,
        required: false,
        default: '59.3318',
      },
      lng: {
        type: String,
        required: false,
        default: '18.0634',
      },
    }
  },
  title: {
    type: String,
    required: true,
  },
  public: {
    type: Boolean,
    required: true,
  },

};

module.exports = mongoose.model('Event', eventSchema);
