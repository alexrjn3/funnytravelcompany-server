import express from "express";
import oferteController from "./../controllers/oferteController.js";
import authController from "../controllers/authController.js";

const router = express.Router();

// router.param('id', tourController.checkID);

router.route("/load/type/:type").get(oferteController.getSomeOferte);
router.route("/type/:type").get(oferteController.getAllTypeOferte);
router.route("/id/:id").get(oferteController.getOferta);
router.route("/tipOferta/:tipOferta").get(oferteController.getTipOferte);

// Protect all routes after this middleware
router.use(authController.protectAPI);

//rutele de post in form:

router.route("/id/:id").patch(oferteController.updateOferta);
router.route("/id/:id").delete(oferteController.deleteOferta);
router.route("/").get(oferteController.getAllOferte);
router.route("/").post(oferteController.createOferta);

export default router;
