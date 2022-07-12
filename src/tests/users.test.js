const request = require("supertest");
const app = require("../app");

describe("Je souhaite tester ici mon environnement routes users", () => {

    const firstUser = {
        "name": "thomas"
    }

    const secondUser = {
        "email": "éric@email.com",
        "password": "password"
    }

    test("Je viens requêter ma méthode GET", async() => {
        const response = await request(app).get("/api/users");
        expect(response.status).toBe(401)
    });

    test("Je viens tester ici le message du retour méthode GET", async() => {
        const response = await request(app).get("/api/users");
        expect(response.text).toEqual("not allowed")
    });

    test("Je viens tester ici ma route post", async() => {
        const response = await request(app).post("/api/users").send(secondUser).expect(201)
        expect(response.status).toBe(201);
    })

    test("Je veux tester ma route delete", async() => {
        const response = await request(app).delete("/api/users/6")
        expect(response.status).toBe(200);

    });
})