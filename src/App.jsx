import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://notepad-api-exbnfyefcse7e6g5.malaysiawest-01.azurewebsites.net";

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  };

  const saveNote = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/notes`, { content: text });
      setText("");
      fetchNotes();
    } catch (err) {
      alert("Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "30px" }}>
        
        <h2 style={{ color: "#1f2937", marginBottom: "20px", textAlign: "center", fontSize: "24px" }}>📝 Professional Notepad</h2>
        
        <div style={{ marginBottom: "20px" }}>
          <textarea 
            placeholder="Write your note here..."
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            style={{ width: "100%", height: "120px", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "16px", resize: "none", boxSizing: "border-box" }}
          />
          <button 
            onClick={saveNote} 
            disabled={loading}
            style={{ width: "100%", marginTop: "12px", padding: "12px", backgroundColor: loading ? "#9ca3af" : "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", fontWeight: "bold", transition: "0.3s" }}
          >
            {loading ? "Saving..." : "Save Note"}
          </button>
        </div>

        <hr style={{ border: "0", borderTop: "1px solid #e5e7eb", margin: "25px 0" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {notes.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280" }}>No notes found. Start writing!</p>
          ) : (
            notes.map((n) => (
              <div key={n.id} style={{ padding: "15px", backgroundColor: "#f9fafb", borderLeft: "4px solid #2563eb", borderRadius: "4px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <p style={{ margin: "0", color: "#374151", lineHeight: "1.5" }}>{n.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;