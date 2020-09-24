import request from "supertest";
import { app } from "../../app";
import {
	admin,
	seedAdmin,
	teams,
	seedTeams,
	fixtures,
	seedFixtures,
} from "../seed/seed";

beforeEach(async function () {
	await seedAdmin();
	await seedTeams();
	await seedFixtures();
});

describe("Fixture", async() => {
	let admin: any;
	beforeEach(async () => {
		admin = await loginAdmin();
	});
	describe("POST: create a fixture", () => {
		it("should create a new fixture when an authenticated admin try to create", (done) => {
			const fixture = {
				home: teams[0].teamId,
				away: teams[2].teamId,
				kick_off: "2020-01-10",
			};

			request(app)
				.post("/api/v1/fixtures")
				.set("Authorization", `bearer ${admin.body.data.token}`)
				.send(fixture)
				.expect(201)
				.expect((res) => {
					expect(res.body.data).toHaveProperty("fixture");
					expect(res.body.data.fixture).toHaveProperty("fixtureId");
				})
				.end(done);
		});

		it("should return 400 if required fields are missing", (done) => {
			const fixture = {};

			request(app)
				.post("/api/v1/fixtures")
				.set("Authorization", `bearer ${admin.body.data.token}`)
				.send(fixture)
				.expect(400)
				.end(done);
		});
	});

	describe("GET Fixture", () => {
		it("should return a fixture", (done) => {
			request(app)
				.get(`/api/v1/fixtures/${fixtures[1]._id}`)
				.set("Authorization", `bearer ${admin.body.data.token}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.data.fixture.fixtureId).toBe(fixtures[1].fixtureId);
				})
				.end(done);
		});

		it("should return all fixtures", (done) => {
			request(app)
				.get("/api/v1/fixtures")
				.set("Authorization", `bearer ${admin.body.data.token}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.data.result).toHaveLength(fixtures.length);
				})
				.end(done);
		});

		it("should return all completed fixtures", (done) => {
			request(app)
				.get("/api/v1/fixtures?status=completed")
				.set("Authorization", `bearer ${admin.body.data.token}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.data.result).toHaveLength(1);
				})
				.end(done);
		});
	});

	describe("Update Fixture", () => {
		it("should update a team", (done) => {
			const update = {
				kick_off: new Date("2021-01-02"),
				status: "completed",
			};
			request(app)
				.put(`/api/v1/fixtures/${fixtures[0].fixtureId}`)
				.set("Authorization", `bearer ${admin.body.data.token}`)
				.send(update)
				.expect(200)
				.expect((res) => {
					expect(res.body.data.fixture.status).toBe(update.status);
				})
				.end(done);
		});
	});

	describe("Remove Fixture", () => {
		it("should allow an admin remove a fixture", (done) => {
			request(app)
				.delete(`/api/v1/fixtures/${fixtures[0].fixtureId}`)
				.set("Authorization", `bearer ${admin.body.data.token}`)
				.expect(200)
				.end(done);
		});
	});
});

async function loginAdmin() {
	return request(app).post("/api/v1/admin/login").send({
		email: admin[0].email,
		password: admin[0].password,
	});
}
