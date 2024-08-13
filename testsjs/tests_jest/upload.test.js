const fs = require('fs');
const test = require("node:test");

const filePath = './file.jpg';
var { get_token } = require("./vars");

test('Upload file via POST API', async () => {
    const token = await get_token();

    const data = await new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return reject(err);
            }
            resolve(data);
        });
    });

    const formData = new FormData();
    const blob = new Blob([data], { type: 'image/png' });
    formData.append('file', blob, 'file.jpg');
    formData.append('alt', 'some alt');
    formData.append('subject', 'subject');

    const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        headers: {
            "Cookie": `token=${token}`,
        },
        body: formData,
        credentials: 'include',
    });

    expect(response.status).toBe(200);

    const responseData = await response.json();
    return responseData.id;  // Return the ID for use in another test, if needed
});

// test('Retrieve image via GET API', async () => {
//     const token = await get_token();

//     const response = await fetch('http://localhost:8000/api/image/9', {
//         method: "GET",
//         headers: {
//             "Cookie": `token=${token}`
//         },
//         credentials: 'include',
//     });

//     expect(response.status).toBe(200);

//     const data = await response.text();
//     console.log(data);
// });
