const axios = require('axios');

const User = require('../models');

async function validateFacebook(accessToken) {
  const url = `https://graph.facebook.com/v2.3/me?access_token=${accessToken}&fields=email,name,picture`;
  return axios.get(url)
    .then(async res => {
      const facebookId = res.data.id;
      const user = await User.findOne({ facebookId })
      const { name, id, email } = res.data

      return {
        name,
        id,
        email,
        picture: res.data.picture.data.url,
        userId: user && user._id,
        phoneNumber: null,
      };
    });
}

function validateGoogle(accessToken) {
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;
  return axios.get(url)
    .then(async res => {
      const googleId = res.data.id;
      const user = await User.findOne({ googleId });
      const { name, id, picture, email } = res.data;
      return {
        name,
        id,
        picture,
        email,
        userId: user && user._id,
        phoneNumber: null,
      };
    });
}

function createNewUser({ id, platform, userName, phoneNumber, email, profilePicture }) {
  const facebookId = platform === 'facebook' ? id : null;
  const googleId = platform === 'google' ? id : null;

  const newUser = new User({ facebookId, googleId, userName, phoneNumber, email, profilePicture });
  newUser.save();

  return newUser;
}

async function removeUser(_id) {
  return new Promise((resolve) => {
    User
      .deleteOne({ _id })
      .then(response => ({
        success: true,
        recordsDeleted: response.n,
      }))
      .catch(() => {
        resolve({
          success: false,
          recordsDeleted: response.n,
        });
      });
  });
}

async function getUser(_id) {
  const [user] = await User.find({ _id });
  return user;
}

async function getUserName(_id) {
  const [user] = await User.find({ _id }, { userName: 1 });
  return user.userName;
}

async function getAllUsers() {
  const users = await User.find({}, { userName: 1 });
  return users;
}

function login({ platform, token }) {
  const validationService = platform === 'facebook' ? validateFacebook : validateGoogle;

  return new Promise((resolve, reject) => {
    validationService(token)
      .then(data => {
        const { userId, name, email, id, picture, phoneNumber } = data;
        const userCredentials = { id, email, userName: name, profilePicture: picture, platform, phoneNumber };

        if (userId) {
          getUser(userId)
            .then(user => resolve(user));
        } else {
          const newUser = createNewUser(userCredentials);
          resolve(newUser)
        }
      })
      .catch(() => reject({ error: true, description: `Invalid Access Token for ${platform}` }));
  });
}

function sendFriendRequest({ userId, friendId }) {
  return new Promise(async (resolve, reject) => {
    try {
      await User.updateOne(
        { _id: userId, outgoing: { $nin: [friendId] } },
        { $push: { 'friends.outgoing': friendId } 
      });

      await User.updateOne(
        { _id: friendId, incoming: { $nin: [userId] } },
        { $push: { 'friends.incoming': userId }
      });
      resolve({ success: true }); 
    } catch (err) {
      reject(err);
    }
  });
}

function acceptFriendRequest({ userId, friendId }) {
  return new Promise(async (resolve, reject) => {
    try {
      await User.updateOne(
        { _id: userId, accepted: { $nin: [friendId] } },
        { $pull: { 'friends.incoming': friendId }, $push: { 'friends.accepted': friendId } }
      );
      await User.updateOne(
        { _id: friendId, accepted: { $nin: [userId] }},
        { $pull: { 'friends.outgoing': friendId }, $push: { 'friends.accepted': userId } }
      );
      resolve({ success: true });
    } catch (err) {
      reject(err);
    }
  });
}

function declineFriendRequest({ userId, friendId }) {
  return new Promise(async (resolve, reject) => {
    try {
      await User.updateOne({ _id: userId }, { $pull: { 'friends.incoming': friendId } });
      await User.updateOne({ _id: friendId }, { $pull: { 'friends.outgoing': friendId } });
      resolve({ sucess: true });
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  createNewUser,
  login,
  getAllUsers,
  getUser,
  login,
  validateFacebook,
  removeUser,
  acceptFriendRequest,
  declineFriendRequest,
  sendFriendRequest,
  getUserName,
};
