const mongoose = require('mongoose');

const userSchema = {
  friends: {
    accepted: {
      type: Array,
      default: [],
      required: false,
    },
    incoming: {
      type: Array,
      default: [],
      required: false,
    },
    outgoing: {
      type: Array,
      default: [],
      required: false,
    },
  },
  facebookId: {
    type: String,
    required: false,
    default: null,
  },
  googleId: {
    type: String,
    required: false,
    default: null,
  },
  userName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    default: null,
  },
  email: {
    type: String,
    required: false,
    default: null,
  },
  profilePicture: {
    type: String,
    required: false,
    default: 'https://propertymarketersllc.com/wp-content/uploads/2018/05/profile-picture-placeholder.png',
  },
  events: {
    attending: {
      type: Array,
      required: false,
      default: [],
    },
    created: {
      type: Array,
      required: false,
      default: [],
    },
    invites: {
      type: Array,
      required: false,
      default: [],
    },
  }
};

module.exports = mongoose.model('User', userSchema);