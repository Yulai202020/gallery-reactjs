const fs = require('fs').promises;

async function get_token() {
    const filePath = "token.json";

    try {
        const jsonData = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(jsonData);
        return data.token;
    } catch (err) {
        console.error('Error:', err);
        return null;
    }
}

module.exports = { get_token };
