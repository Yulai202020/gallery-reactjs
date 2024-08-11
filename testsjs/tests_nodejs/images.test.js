var { get_token } = require("./vars");
const test = require("node:test");

test('POST API Tests', async () => {
    const token = await get_token();

    const response = await fetch('http://localhost:8000/api/images', {
        method: 'GET',
        headers: {
            "Cookie": `token=${token}`
        },
        credentials: 'include',
    });

    // expect(response.status).toBe(200);

    const data = await response.json();
    console.log(data);
});
