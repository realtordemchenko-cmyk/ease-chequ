const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = "D:/Projects/Ease Chequ";
const intakePath = path.join(DATA_DIR, "intake.json");
const uploadsPath = path.join(DATA_DIR, "uploads.json");

app.use(express.static(DATA_DIR));

// GET /agent/status/:groupId
app.get("/agent/status/:groupId", (req, res) => {
    const groupId = req.params.groupId;
    const intake = fs.existsSync(intakePath) ? JSON.parse(fs.readFileSync(intakePath)) : [];
    const uploads = fs.existsSync(uploadsPath) ? JSON.parse(fs.readFileSync(uploadsPath)) : [];

    const group = intake.find(g => g.groupId === groupId);
    if (!group) return res.json({ clients: [], uploads: [] });

    res.json({ clients: group.clients || [], uploads });
});

// GET /agent/groups
app.get("/agent/groups", (req, res) => {
    const intake = fs.existsSync(intakePath) ? JSON.parse(fs.readFileSync(intakePath)) : [];
    const uploads = fs.existsSync(uploadsPath) ? JSON.parse(fs.readFileSync(uploadsPath)) : [];

    const groups = intake.map(group => {
        const allUploaded = group.clients.every(client =>
            uploads.some(u => u.clientId === client.clientId)
        );
        return {
            groupId: group.groupId,
            agentId: group.agentId,
            completed: allUploaded
        };
    });

    res.json(groups);
});

// POST /agent/add-client
app.post("/agent/add-client", (req, res) => {
    const { groupId, agentId, name, surname, email, role } = req.body;
    const intake = fs.existsSync(intakePath) ? JSON.parse(fs.readFileSync(intakePath)) : [];

    let group = intake.find(g => g.groupId === groupId);
    if (!group) {
        group = { groupId, agentId, clients: [] };
        intake.push(group);
    }

    group.clients.push({
        clientId: email,
        name: `${name} ${surname}`,
        email,
        role
    });

    fs.writeFileSync(intakePath, JSON.stringify(intake, null, 2));
    res.json({ success: true });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Agent backend running on port ${PORT}`);
});