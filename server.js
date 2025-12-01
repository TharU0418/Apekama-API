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
// POST /partcapi  (NEW - Add Poya Day)
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
// GET /partcapi  (NEW - Get Poya Days)
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
// START SERVER
// --------------------------------------
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
