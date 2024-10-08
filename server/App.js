// imports
const cookieParser = require("cookie-parser");
const express = require("express");
const multer = require("multer");
var cors = require("cors")

const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const sharp = require('sharp');

// include prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// init app
const app = express();
const PORT = 8000;

// init needed vars
var photos_folder = "photos"
var encrypter = "ibutytuiu89r56tcyjhknklihg8fty"

// init cors optoin
var corsOptions = {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

// start server
app.listen(PORT, () => console.log("Server started."));

// apply extensions to app
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add storage for upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/api/removeall", async (req, res) => {
    const token = req.cookies.token;
    var username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        return res.status(403).json({ message: "Token is expired" });
    }

    await prisma.images.deleteMany({ where: { username: username } })
    console.log("Deleted all images from user:")
    console.log(username);

    return res.status(200).json({ message: "OK" });
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
    const { subject, alt } = req.body;
    const token = req.cookies.token;
    let username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch (error) {
        return res.status(403).json({ message: "Token is expired" });
    }

    if (!req.file) {
        return res.status(404).send("No file uploaded.");
    }

    const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!supportedMimeTypes.includes(req.file.mimetype)) {
        return res.status(415).json({ message: "Unsupported file format." });
    }

    let response;
    try {
        response = await prisma.images.create({ data: { alt: alt, subject: subject, username: username, state: false } });
    } catch (err) {
        console.error("Error saving metadata to the database:", err);
        return res.status(500).json({ message: "Error saving metadata." });
    }

    console.log("Uploaded image:");
    console.log(response);

    const uploadPath = path.join(__dirname, photos_folder, username, String(response.id));
    fs.mkdirSync(uploadPath, { recursive: true });

    const originalFilePath = path.join(uploadPath, "original");
    const file800pxPath = path.join(uploadPath, "800w");
    const file400pxPath = path.join(uploadPath, "400w");
    const file200pxPath = path.join(uploadPath, "200w");
    const file100pxPath = path.join(uploadPath, "100w");

    res.status(200).json({ message: "OK", id: response.id });

    if (fs.existsSync(originalFilePath)) {
        return res.status(409).json({ message: "File already exists." });
    }

    try {
        await sharp(req.file.buffer).webp({ quality: 80 }).toFile(originalFilePath + ".webp");
        await sharp(req.file.buffer).resize({ width: 800 }).webp({ quality: 80 }).toFile(file800pxPath + ".webp");
        await sharp(req.file.buffer).resize({ width: 400 }).webp({ quality: 80 }).toFile(file400pxPath + ".webp");
        await sharp(req.file.buffer).resize({ width: 200 }).webp({ quality: 80 }).toFile(file200pxPath + ".webp");
        await sharp(req.file.buffer).resize({ width: 100 }).webp({ quality: 80 }).toFile(file100pxPath + ".webp");

        await sharp(req.file.buffer).avif({ quality: 80 }).toFile(originalFilePath + ".avif");
        await sharp(req.file.buffer).resize({ width: 800 }).avif({ quality: 80 }).toFile(file800pxPath + ".avif");
        await sharp(req.file.buffer).resize({ width: 400 }).avif({ quality: 80 }).toFile(file400pxPath + ".avif");
        await sharp(req.file.buffer).resize({ width: 200 }).avif({ quality: 80 }).toFile(file200pxPath + ".avif");
        await sharp(req.file.buffer).resize({ width: 100 }).avif({ quality: 80 }).toFile(file100pxPath + ".avif");
    } catch (err) {
        console.error("Error converting the image to WebP:", err);
    }

    try {
        await prisma.images.update({ where: { id: response.id }, data: { state: true } });
    } catch {
        return;
    }

    console.log("Converted image correctly.");

    return;
});

app.get("/api/image/:id/:type", async (req, res) => {
    // get username
    const token = req.cookies.token;
    const id = Number(req.params.id);
    const type = req.params.type;
    var username;
    
    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        return res.status(403).json({ message: "Token is expired" });
    }

    const response = await prisma.images.findFirst({ where: { id: id, username: username } });
    if (response === null) {
        return res.status(404).send({ message: 'File not found' });
    }

    var type1;

    if (type == "100") {
        type1 = "100w.webp";
    } else if (type == "200") {
        type1 = "200w.webp";
    }  else if (type == "400") {
        type1 = "400w.webp";
    }  else if (type == "800") {
        type1 = "800w.webp";
    } else if (type == "download") {
        type1 = "original.webp";
        res.set('Content-Disposition', 'attachment');
    } else {
        type1 = "original.webp";
    }

    const filePath = path.join(__dirname, 'photos', username, String(id), type1);
    return res.status(200).sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            return res.status(500).send({ message: 'Error sending file' });
        }
    });
});

app.get("/api/images", async (req, res) => {
    const token = req.cookies.token;
    var username;

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        return res.status(403).json({ message: "Token is expired" });
    }

    const response = await prisma.images.findMany({ where: { username: username, state: true } })
    console.log("Sended images:")
    console.log(response);

    return res.status(200).json(response);
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const response = await prisma.user.findFirst({ where: { username: username }});

    if (response === null) {
        return res.status(404).json({ message: "Username not found" });
    }
    if (response.password !== password) {
        return res.status(403).json({ message: "Invalid password" });
    }

    console.log("Logined in user:");
    console.log(response)

    const token = jwt.sign({ username }, encrypter, { expiresIn: "1h" });
    return res.status(200).json({ token });
});

app.post("/api/remove", async (req, res) => {
    const { id } = req.body;
    const token = req.cookies.token;

    var username;
    var numId = Number(id);

    try {
        username = jwt.verify(token, encrypter).username;
    } catch {
        return res.status(403).json({ message: "Token is expired" });
    }

    const response = await prisma.images.findFirst({ where: { id: numId, username: username} });

    console.log("Removed image:");
    console.log(response)

    if (response !== null) {
        const deleteFolder = path.join(__dirname, photos_folder, username, String(id));

        fs.rm(deleteFolder, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error("Error deleting the file:", err);
                return res.status(500).send({ message: "Error deleting the file" });
            }
        });
    } else {
        return res.status(404).send({ message: "File not found." });
    }

    await prisma.images.delete({ where: { id: numId, username: username} });

    return res.status(200).json({ message: "OK" });
});

app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    const response = await prisma.user.findFirst({ where: { username: username }});

    if (response === null) {
        const user = await prisma.user.create({ data: { username: username,  password: password }});
        const token = jwt.sign({ username }, encrypter, { expiresIn: "1h" });
        
        console.log("Created user:");
        console.log(user)

        const folder_path = path.join(photos_folder, username);
        fs.mkdirSync(folder_path, { recursive: true });
        
        return res.status(200).json({ token });
    } else {
        return res.status(403).json({ message: "User already exists" });
    }
});