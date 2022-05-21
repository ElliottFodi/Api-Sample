import app from '#src/Routes/routes'
import { request } from 'supertest'


describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const response = await request(app)
      .post("/post")
      .send({
        user_id: '1234',
        content: 'my post'
      })
    expect(response.statusCode).toBe(200);
  });
});