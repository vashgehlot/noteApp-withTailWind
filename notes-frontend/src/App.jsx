import { useState } from 'react'
import Refresh from "./assets/icons/refresh.svg?react";
import { useEffect } from 'react';

function App() {

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const API = "http://localhost:5000/api/notes";

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes"));
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  useEffect(() => {
    fetchQuote();
  }, []);

  function fetchQuote() {
    setLoading(true);

    fetch("https://dummyjson.com/quotes/random")
      .then((res) => res.json())
      .then((data) => {
        setQuote(data.quote);
        setLoading(false);
      })
      .catch(() => {
        setApiError("Unable to fetch");
        setLoading(false);
      });
  }

  // function addNote() {                              // Add and Update Functionality
  //   if (note.trim() === "") {
  //     setError("Please enter a valid note");
  //     return;
  //   }
  //   setError("");

  //   if (editIndex !== null) {                       // Koi purana note edit ho raha hai.
  //     const updatedNotes = [...notes];              // Purane notes ka copy bana liya.
  //     updatedNotes[editIndex] = note;               // Us index pe new text replace kar diya.
  //     setNotes(updatedNotes);                       // List updated krdi.
  //     setEditIndex(null);                           // Edit index reset krdi. Edit mode band.
  //   } else {
  //     setNotes([...notes, note]);                   // New note add krdia if edit mode ni hai.
  //   }

  //   setNote("");
  // }


  function addNote() {
    if (!note.trim()) return;

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: note })
    })
      .then(res => res.json())
      .then(saved => {
        setNotes([...notes, saved]);
        setNote("");
      });
  }

  // function deleteNote(indexToDelete) {
  //   setNotes(notes.filter((_, index) => index !== indexToDelete));
  // }

  function deleteNote(id) {
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(() => {
        setNotes(notes.filter(n => n._id !== id));
      });
  }

  function highlightText(text, search) {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="text-red-500 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  return (

    <div className="min-h-screen bg-slate-100 flex justify-center py-60">
      <div className="bg-white w-[520px] p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-red-500 mb-4"> Notes App</h1>

        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search"
            className="w-24 border border-slate-300 rounded-lg px-2 py-2 text-sm focus:ring-2 focus:ring-slate-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter your note"
            className="flex-1 border-2 border-red-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-300"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            onClick={addNote}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 whitespace-nowrap"
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm py-2">{error}</p>}

        <ul >
          {notes.filter((item) => item.text.toLowerCase().includes(search.toLowerCase())).map((item) => (
            <li key={item._id}
              className="bg-slate-200 p-3 rounded flex items-center justify-between">
              <span
                onClick={() => {
                  setNote(item.text);
                  setEditIndex(item._id);
                }}
                className="cursor-pointer text-slate-700"              >
                {highlightText(item.text, search)}
              </span>

              <button
                onClick={() => deleteNote(item._id)}
                className="text-red-500 hover:text-red-700 text-lg font-bold">
                X
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 p-4 bg-slate-100 rounded">
          <h2 className="font-bold text-red-400 mb-2">Random Quote</h2>

          {loading && <p>Loading...</p>}
          {apiError && <p className="text-red-500">{apiError}</p>}
          {!loading && !apiError && <p>{quote}</p>}
        </div>

        <button
          onClick={fetchQuote}
          className="mt-2 text-sm text-red-500 hover:underline"
        >
          <Refresh className="w-5 h-5" />
        </button>

      </div>
    </div>
  )
}

export default App
