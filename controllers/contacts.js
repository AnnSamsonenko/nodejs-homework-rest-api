const { contacts } = require("../services");
const { NotFound } = require("http-errors");

const listContacts = async (req, res, next) => {
  try {
    const result = await contacts.listContacts();

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await contacts.getById(id);

    if (!contact) {
      throw new NotFound("Not found");
    }

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const newContact = await contacts.addContact(req.body);

    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        newContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactToDelete = await contacts.removeContact(id);

    if (!contactToDelete) {
      throw new NotFound("Not found");
    }

    res.status(200).json({
      status: "success",
      code: 200,
      message: "Contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedContact = await contacts.updateContact(id, req.body);

    if (!updatedContact) {
      throw new NotFound("Not found");
    }

    res.status(200).json({
      status: "success",
      code: 201,
      data: {
        updatedContact,
      },
    });
  } catch (error) {
    if (error.message.includes("duplicate")) {
      error.status = 400;
    }
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedContact = await contacts.updateContact(id, req.body);
    if (!updatedContact) {
      throw new NotFound("Not found");
    }
    res.status(200).json({
      status: "success",
      code: 201,
      data: {
        updatedContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
