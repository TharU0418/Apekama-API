require("dotenv").config();      // Load .env file

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// --------------------------------------
// MONGO CONNECTION
// --------------------------------------
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Error:", err));


// --------------------------------------
// HOLIDAY SCHEMA
// --------------------------------------
const HolidaySchema = new mongoose.Schema({
    date: { type: String, required: true },
    holidayName: { type: String, required: true },
    holidayTime: { type: String, required: true },
    holidayType: {
        type: [String],
        required: true,
        enum: [
            "public holiday",
            "bank holiday",
            "mercantile holiday",
            "poya holiday"
        ]
    }
});

const Holiday = mongoose.model("Holiday", HolidaySchema);


// --------------------------------------
// POYA DAY SCHEMA (NEW)
// --------------------------------------
const PoyaDaySchema = new mongoose.Schema({
    day: { type: String, required: true },
    time: {type: String, required: true },
    poyaType: {
        type: [String],
        required: true,
        enum: [
            "type1",
            "type2",
            "type3",
            "type4"
        ]
    }
});

const PoyaDay = mongoose.model("PoyaDay", PoyaDaySchema);


// --------------------------------------
// PART D SCHEMA (NEW)
// --------------------------------------
const PartDSchema = new mongoose.Schema({
    day: { type: String, required: true },
    description: { type: String, required: true }
});

const PartD = mongoose.model("PartD", PartDSchema);


// --------------------------------------
// POST /partbapi  (Add Holiday)
// --------------------------------------
app.post("/partbapi", async (req, res) => {
    try {
        const holiday = new Holiday(req.body);
        await holiday.save();
        res.status(201).json({ message: "Holiday saved", holiday });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --------------------------------------
// GET /partbapi (Get Holidays)
// --------------------------------------
app.get("/partbapi", async (req, res) => {
    try {
        const holidays = await Holiday.find();
        res.json(holidays);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --------------------------------------
// POST /partcapi  (Add Poya Day)
// --------------------------------------
app.post("/partcapi", async (req, res) => {
    try {
        const poya = new PoyaDay(req.body);
        await poya.save();
        res.status(201).json({ message: "Poya day saved", poya });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --------------------------------------
// GET /partcapi (Get Poya Days)
// --------------------------------------
app.get("/partcapi", async (req, res) => {
    try {
        const poyaDays = await PoyaDay.find();
        res.json(poyaDays);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --------------------------------------
// POST /partdapi  (Add Day and Description)
// --------------------------------------
app.post("/partdapi", async (req, res) => {
    try {
        const partD = new PartD(req.body);
        await partD.save();
        res.status(201).json({ message: "Day and Description saved", partD });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --------------------------------------
// GET /partdapi (Get All Day and Descriptions)
// --------------------------------------
app.get("/partdapi", async (req, res) => {
    try {
        const partDRecords = await PartD.find();
        res.json(partDRecords);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --------------------------------------
// START SERVER
// --------------------------------------
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
