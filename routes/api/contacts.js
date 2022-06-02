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

// const express = require("express");
// const {
// listContacts, getById, addContact, removeContact, updateContact
// } = require("../../controllers/contacts");
// const router = express.Router();
// const { schemaPatch, schemaCreate } = require("../../models/product");
// const { validateRequest } = require("../../middlewares/validateRequest");

// router.get("/", getAll);
// // TODO: add validation for id using mongoose function isValidObjectId (for sending correct status)
// router.get("/:id", getById);
// router.post("/", validateRequest(schemaCreate), create);
// router.put("/:id", updateById);
// router.patch("/:id/available", validateRequest(schemaPatch), updateAvailability);
// router.delete("/:id", deleteById);

// module.exports = router;
