import bookingRepository from "@/repositories/booking-repository";


async function getBooking(userId: number) {
    const result = await bookingRepository.findbooking(userId);
    if (!result) {
        throw { name: "NotFoundError" }
    }
    return result;
};

async function createBooking(userId: number, roomId: number) {
    const userBooking = await bookingRepository.findbooking(userId);
    if (userBooking) {
        throw { name: "FORBIDDEN" }
    }

    const enrollment = await bookingRepository.findEnrollment(userId)
    if (!enrollment) {
        throw { name: "FORBIDDEN" }
    }

    const ticket = await bookingRepository.findTicket(enrollment.id)
    if (!ticket || ticket.status === "RESERVED") {
        throw { name: "FORBIDDEN"}
    }

    const ticketType = await bookingRepository.findTicketType(ticket.ticketTypeId)
    if (ticketType.isRemote === true || ticketType.includesHotel === false) {
        throw { name: "FORBIDDEN"}
    }

    const room = await bookingRepository.findRoom(roomId);
    if (!room) {
        throw { name: "NotFoundError"}
    }

    const booking = await bookingRepository.getCheckCapacity(room.id);
    if (room.capacity === booking.length) {
        throw { name: "FORBIDDEN"}
    }


    const createdBooking = await bookingRepository.createBooking(userId, roomId);

    return createdBooking;
};

async function updateBooking(userId: number, roomId: number, bookingId: number) {
  
    const room = await bookingRepository.findRoom(roomId);
    if (!room) {
        throw { name: "NotFoundError"}
    }

    const bookingUp = await bookingRepository.updateBooking(bookingId, roomId);
    return bookingUp;

};

const bookingService = {
    getBooking,
    createBooking,
    updateBooking
};

export default bookingService;