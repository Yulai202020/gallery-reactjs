const fs = require('fs');
const test = require("node:test");

const filePath = 'file.txt';
var { get_token } = require("./vars");

test('POST API Tests', async () => {
    const token = await get_token();

    fs.readFile(filePath, async (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const formData = new FormData();
        const blob = new Blob([data], { type: 'text/plain' }); // Change the MIME type as needed
        formData.append('file', blob, 'file.txt');
        formData.append('alt', 'some alt');
        formData.append('subject', 'subject');

        try {
            const response = await fetch('http://localhost:8000/api/upload', {
                method: 'POST',
                headers: {
                    "Cookie": `token=${token}`
                },
                body: formData,
                credentials: 'include',
            });

            expect(response.status).toBe(200);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    });
});
