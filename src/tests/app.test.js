const request = require("supertest");
const app = require("../app");

describe("Je souhaite vérifier l'état de ma route principale app", () => {
    test("Je dois retourner ma méthode GET sur ma route /", async() => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
    })
})