import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import { Response } from "express";
import bookingService from "@/services/booking-service";
import hotelService from "@/services/hotels-service";


export async function getBooking(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }


}


export async function createBooking(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const { userId } = req;
  const { roomId } = req.body;

  try {

    const booking = await bookingService.createBooking(userId, Number(roomId))
    return res.status(httpStatus.OK).send(booking)
  } catch (error) {
   
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }
    if (error.name === "FORBIDDEN") {
      return res.sendStatus(httpStatus.FORBIDDEN)
    }
  }
}


export async function updateBooking(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const { userId } = req;
  const { roomId } = req.body;
  const { bookingId } = req.params;

  try {
    const updateBooking = bookingService.updateBooking(userId, Number(bookingId), Number(roomId));
    return res.status(200).send(updateBooking);
  } catch (error) {
    
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND)
    }
    if (error.name === "FORBIDDEN") {
      return res.sendStatus(httpStatus.FORBIDDEN)
    }
  }
}