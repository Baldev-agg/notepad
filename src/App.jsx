import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);

  // const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://notepad-api-exbnfyefcse7e6g5.malaysiawest-01.azurewebsites.net";
  const fetchNotes = async () => {
    const res = await axios.get(`${API_BASE}/api/notes`);
    setNotes(res.data);
  };

  const saveNote = async () => {
    await axios.post(`${API_BASE}/api/notes`, {
      content: text,
    });
    setText("");
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <h2>Notepad App</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <br />
      <button onClick={saveNote}>Save</button>

      <ul>
        {notes.map((n) => (
          <li key={n.id}>{n.content}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
