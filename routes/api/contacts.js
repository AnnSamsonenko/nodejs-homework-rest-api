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
const { validateRequest } = require("../../middlewares/validateRequest");

const router = express.Router();

router.get("/", listContacts);

router.get("/:id", getById);

router.post("/", validateRequest(schemaCreate), addContact);

router.delete("/:id", removeContact);

router.put("/:id", updateContact);

router.patch("/:id", validateRequest(schemaPatch), updateStatusContact);

module.exports = router;
