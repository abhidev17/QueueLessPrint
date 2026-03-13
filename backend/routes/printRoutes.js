const express = require("express");
const router = express.Router();
const printController = require("../controllers/printController");
const upload = require("../config/multerConfig");

router.post("/create", upload.single("document"), printController.createPrintJob);

router.get("/all", printController.getAllPrintJobs);

router.get("/slots", printController.getSlotAvailability);

router.put("/status/:id", printController.updatePrintStatus);

module.exports = router;