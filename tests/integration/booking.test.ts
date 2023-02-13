import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import { createBooking, createEnrollmentWithAddress, createHotel, createRoomWithHotelId, createTicket, createTicketTypeWithHotel, createUser } from "../factories";


beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/booking");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("User has no reservation: Must return status code 404.", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status 200 when user has reservations", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const bookingCreate = await createBooking(user.id, room.id);

        const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
    });
});


describe("POST /booking", () => {

    it("should respond with status 401 if no token is given", async () => {
        const response = await server.post("/booking");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 403 if there is no enrollment", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)

        const response = await server.post("/booking").set(`Authorization`, `Bearer ${token}`).send({ roomId: room.id });

        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if there is no ticket", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id)
        const enrollment = await createEnrollmentWithAddress(user)

        const response = await server.post("/booking").set(`Authorization`, `Bearer ${token}`).send({ roomId: room.id });

        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it("should respond with status 403 if the room is full", async () => {
        const user = await createUser();
        const user2 = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        await createBooking(user2.id, room.id)
        await createBooking(user2.id, room.id)
        await createBooking(user2.id, room.id)
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");


        const response = await server.post("/booking").set(`Authorization`, `Bearer ${token}`).send({ roomId: room.id });

        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it("should respond with status 404 if roomId not exist", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
    
    
        const response = await server.post("/booking").set(`Authorization`, `Bearer ${token}`).send({roomId: 0});
        
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
    it("should respond with status 403 if booking alredy exist", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        await createBooking(user.id, room.id)
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");


        const response = await server.post("/booking").set(`Authorization`, `Bearer ${token}`).send({ roomId: room.id });

        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
    it("should respond with status 200 if all is ok", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");


        const response = await server.post("/booking").set(`Authorization`, `Bearer ${token}`).send({ roomId: room.id });

        expect(response.status).toBe(httpStatus.OK);
    });
});

describe("PUT /booking/:bookingId", () => {
    it("should respond with status 401 if no token is given", async () => {
        const response = await server.put("/booking");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.put("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.put("/booking").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 404 if roomId not exist", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, "PAID");
    
    
        const response = await server.put("/booking").set(`Authorization`, `Bearer ${token}`).send({roomId: 0});
        
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

    it("should respond with status 200 if all is ok", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking(user.id, room.id)

        const response = await server.put(`/booking/${booking.id}`).set(`Authorization`, `Bearer ${token}`).send({ roomId: room.id });

        expect(response.status).toBe(httpStatus.OK);
    });

    


});

