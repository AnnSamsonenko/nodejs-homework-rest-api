const express = require("express");
const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");
const { schemaPatch, schemaCreate } = require("../../models/contact");
const { validateId, validateRequest, auth } = require("../../middlewares");

const router = express.Router();

router.get("/", auth, listContacts);

router.get("/:id", auth, validateId, getById);

router.post("/", validateRequest(schemaCreate), auth, addContact);

router.delete("/:id", auth, validateId, removeContact);

router.put("/:id", auth, validateId, updateContact);

router.patch("/:id", auth, validateId, validateRequest(schemaPatch), updateStatusContact);

module.exports = router;
