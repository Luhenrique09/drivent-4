import { prisma } from "@/config";

async function findbooking(userId: number) {
    return prisma.booking.findFirst({
        where: {
             userId
        },
        select: {
            id: true,
            Room: true,
        }
    });
  }
  
  async function createBooking(userId: number, roomId: number) {
    return prisma.booking.create({
        data:{
            userId,
            roomId
        }
    })
  }

  async function updateBooking(bookingId: number, roomId: number) {
    return prisma.booking.update({
        where:{
            id: bookingId
        },
        data: {
            roomId
        }
    })
  };

  async function getBookingRepoById(bookingId: number) {
    return prisma.booking.findFirst({
      where: {
        id: bookingId
      },
      select: {
        id: true
      }
    });
  }


  async function getCheckCapacity(roomId: number) {
    return prisma.room.findFirst({
        where:{
            id: roomId
        },
        select: {
            capacity: true,
            _count:{
                select: {
                    Booking: true
                }
            }
        }
    })
  }
  


  
  const bookingRepository = {
    findbooking,
    createBooking,
    updateBooking,
    getCheckCapacity,
    getBookingRepoById
  };
  
  export default bookingRepository;
  