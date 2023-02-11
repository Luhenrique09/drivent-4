import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { Response } from "express";
import bookingService from "@/services/booking-service";


export async function getBooking(req: AuthenticatedRequest, res: Response) : Promise<Response> {
    const { userId } = req;

  try {
    const booking = await bookingService.getBooking(Number(userId));
    return res.status(200).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}


export async function createBooking(req: AuthenticatedRequest, res: Response) {
    const {userId} =req;
    const {roomId} = req.body;

    try {
       const bookingId = await bookingService.createBooking(userId, Number(roomId))
        return res.status(200).send(bookingId)
    } catch (error) {
        res.status(error.status || httpStatus.FORBIDDEN);
    return res.send(error);
    }
}


export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const {userId} = req;
    const {roomId} = req.body;
    const {bookingId} = req.params;

    try {
      const updateBookingId = bookingService.updateBooking(userId, Number(bookingId), Number(roomId));
      return res.status(200).send(updateBookingId);
    } catch (error) {
      res.status(error.status || httpStatus.FORBIDDEN);
    return res.send(error);
    }
}