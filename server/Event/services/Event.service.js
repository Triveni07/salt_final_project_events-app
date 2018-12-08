const mongoose = require('mongoose');

const Event = require('../model');
const User = mongoose.models.User;

async function createNewEvent(eventDetails) {
  const creator = await User.findOne({ _id: eventDetails.id });
  const createdBy = { name: creator.userName, id: eventDetails.id };

  const { accepted } = creator.friends;
  await User.updateMany({ _id: { $in: accepted } }, { $push: { 'events.invites': eventDetails.id }});

  const newEvent = new Event({ ...eventDetails, createdBy });
  await User.updateOne({ _id: eventDetails.id }, { $push: { 'events.created': newEvent._id } });
  return newEvent.save();
}

function getUserEvents(_id) {
  return new Promise(async resolve => {
    const user = await User.findOne({ _id });
    const { attending, created, invites } = user.events;
    const eventIds = [...attending, ...created, ...invites];
    const events = await Event.find({ _id: { $in: eventIds } });

    resolve({
      attending: events.filter(evt => attending.some(id => evt._id.equals(id))),
      created: events.filter(evt => created.some(id => evt._id.equals(id))),
      invites: events.filter(evt => invites.some(id => evt._id.equals(id))),
    });
  });
}

function getAttendingById(_id) {
  return new Promise(async resolve => {
    const [user] = await User.find({ _id });
    const eventIds = user.events.attending;
    const eventData = await Event.find({ _id: { $in: eventIds }});
    resolve(eventData.filter(evt => evt.public));
  })
}

async function getPublicEvents() {
  const events = await Event.find({ public: true });
  return events;
}

async function updateEvent(eventDetails, _id) {
  const events = await Event.updateOne({ _id }, eventDetails);
  return events;
}

async function getEventByCategory(category) {
  const events = await Event.find({ category });
  return events;
}

async function toggleAttendancePublicEvent({ eventId, userId }) {
  const query = { _id: userId, 'events.attending': { $in: eventId } };
  const isAttending = await User.findOne(query);

  if (isAttending) {
    return unattendPublicEvent({ eventId, userId });
  } else {
    return attendPublicEvent({ eventId, userId });
  }
}

async function attendPublicEvent({ eventId, userId }) {
  const updatedEvent = await Event.updateOne({ _id: eventId, public: true }, { $push: { attending: userId } });

  if (updatedEvent) {
    await User.updateOne({ _id: userId }, { $push: { 'events.attending': eventId } });
    return { success: true };
  }
  return { success: false };
}

async function unattendPublicEvent({ eventId, userId }) {
  const updatedEvent = await Event.updateOne({ _id: eventId, public: true }, { $pull: { attending: userId } });

  if (updatedEvent) {
    await User.updateOne({ _id: userId }, { $pull: { 'events.attending': eventId } });
    return { success: true };
  }
  return { success: false };
}


module.exports = {
  createNewEvent,
  getPublicEvents,
  updateEvent,
  getEventByCategory,
  toggleAttendancePublicEvent,
  getUserEvents,
  getAttendingById,
};