const express = require("express");
const { NotFound, BadRequest } = require("http-errors");
const Joi = require("joi");

const router = express.Router();
const contactsOperations = require("../../models/contacts");

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  phone: Joi.string().min(6).max(15).required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsOperations.listContacts();

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await contactsOperations.getById(id);

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
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest("Missing required field");
    }
    const newContact = await contactsOperations.addContact(req.body);

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
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const contactToDelete = await contactsOperations.removeContact(id);
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
});

router.put("/:id", async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);

    if (error) {
      throw new BadRequest("Missing fields");
    }

    const { id } = req.params;
    const updatedContact = await contactsOperations.updateContact(id, req.body);

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
});

module.exports = router;
