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
        }, select:{
          roomId: true
        }
    })
  }

  async function findEnrollment(userId: number) {
    return prisma.enrollment.findFirst({
      where: {userId}
    })
  }

  async function updateBooking(bookingId: number, roomId: number) {
    return prisma.booking.update({
        where:{
            id: bookingId
        },
        data: {
            roomId
        },
        select:{
          roomId:true
        }
    })
  };

 


  async function getCheckCapacity(roomId: number) {
    return prisma.booking.findMany({
      where: {
        roomId
      }
    })
  }
  
  async function findTicketType(id: number) {
    return prisma.ticketType.findFirst({
      where: {
        id
      }
    })
  }

  async function findTicket(enrollmentId: number) {
    return prisma.ticket.findFirst({
      where: {
        enrollmentId
      }
    })
  }

  async function findRoom(id: number) {
    return prisma.room.findUnique({
      where: {id}
    })
  }
  
  const bookingRepository = {
    findbooking,
    createBooking,
    updateBooking,
    getCheckCapacity,
    findTicketType,
    findEnrollment,
    findTicket,
    findRoom
  };
  
  export default bookingRepository;
  