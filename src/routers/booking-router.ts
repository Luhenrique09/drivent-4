import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { createBooking, getBooking, updateBooking } from "@/controllers";


const bookingRouter = Router();

bookingRouter
    .all("/*", authenticateToken)
    .get("/booking", getBooking)
    .post("/booking", createBooking)
    .patch("/booking/:bookingId", updateBooking)

export { bookingRouter };