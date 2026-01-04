import express from "express";
import Note from "../models/note.js";

const router = express.Router();

// CREATE note
router.post("/", async (req, res) => {
    const note = new Note({ text: req.body.text });
    const saved = await note.save();
    res.json(saved);
});

// READ all notes
router.get("/", async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

// DELETE note
router.delete("/:id", async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

export default router;
