const { Contact } = require("../models/contact");

const listContacts = async () => {
  return Contact.find().populate("owner");
};

const getById = async contactId => {
  return Contact.findById(contactId);
};

const removeContact = async contactId => {
  return Contact.findByIdAndDelete(contactId);
};

const addContact = async body => {
  return Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate(contactId, body, { new: true });
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
