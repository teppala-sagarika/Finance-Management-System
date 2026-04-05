const express = require("express");
const router = express.Router();

const {
    create,
    getAll,
    update,
    remove,
} = require("../controllers/recordController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");
const recordSchema = require("../validations/recordValidation");

router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    validate(recordSchema),
    create
);

router.get("/", authMiddleware, getAll);

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "analyst"),
    update
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    remove
);

module.exports = router;