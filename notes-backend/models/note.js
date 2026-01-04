import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    text: String,
});

export default mongoose.model("Note", noteSchema);
