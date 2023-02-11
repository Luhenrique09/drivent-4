import { requestError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import httpStatus from "http-status";

async function getBooking(userId: number){
    const result = await bookingRepository.findbooking(userId);
    if(!result){
        throw requestError(httpStatus.NOT_FOUND, "Booking not found");
    }
    return result;
};

async function createBooking(userId: number, roomId: number){
   
    if(!roomId){
        throw requestError(httpStatus.NOT_FOUND, "Room not found");
    }

    const roomCapacityAndBookings = await bookingRepository.getCheckCapacity(roomId);
    if (roomCapacityAndBookings._count.Booking === roomCapacityAndBookings.capacity) {
      throw requestError(httpStatus.FORBIDDEN, "Room without vacancies");
    }

    const booking = await bookingRepository.findbooking(userId);
    if(!booking){
        throw requestError(httpStatus.FORBIDDEN, "User already has a booking");
    }

    const createdBooking = await bookingRepository.createBooking(userId, roomId);

    return {id: createdBooking.id};
};  

async function updateBooking(userId: number, roomId: number, bookingId: number){
    const booking = await bookingRepository.findbooking(userId);
    if(booking.id !== bookingId ){
        throw requestError(httpStatus.FORBIDDEN, "It is not possible to change the reservation")
    }
    const roomCapacityAndBookings = await bookingRepository.getCheckCapacity(roomId);
    if (roomCapacityAndBookings._count.Booking === roomCapacityAndBookings.capacity) {
      throw requestError(httpStatus.FORBIDDEN, "Room without vacancies");
    }

    if(!roomId){
        throw requestError(httpStatus.NOT_FOUND, "Room not found");
    }
    const result = await bookingRepository.getBookingRepoById(bookingId);
    if (!result) {
      throw requestError(httpStatus.NOT_FOUND, "Booking not found");
    }

    const bookingUp = await bookingRepository.updateBooking(bookingId, roomId);
    return {bookingId: bookingUp.id};

};

const bookingService = {
    getBooking,
    createBooking,
    updateBooking
};

export default bookingService;