import express from "express";
import {
  createConsumer,
  getAllConsumers,
  getConsumerById,
  updateConsumer,
  deleteConsumer,
} from "../controllers/consumer.controller.js";

const router = express.Router();

// Define routes for consumer operations
router
  .route("/")
  .post(createConsumer) // POST /api/consumers - Create a new consumer
  .get(getAllConsumers); // GET /api/consumers - Get all consumers

router
  .route("/:id")
  .get(getConsumerById) // GET /api/consumers/:id - Get a single consumer by ID
  .put(updateConsumer) // PUT /api/consumers/:id - Update a consumer by ID
  .delete(deleteConsumer); // DELETE /api/consumers/:id - Delete a consumer by ID

export default router;
