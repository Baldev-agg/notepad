import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Local testing ke liye localhost aur prod ke liye Azure link
  // const API_BASE = "https://localhost:7239";
   const API_BASE = "notepad-api-exbnfyefcse7e6g5.malaysiawest-01.azurewebsites.net";

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
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
      alert("Save failed!");
    } finally {
      setLoading(false);
    }
  };

  //edit note function 
  const editNote = async (id, content)=>{
    try{
      await axios.put(`${API_BASE}/api/notes/${id}`, {id:id, content:content});
      fetchNotes();
    }catch(err){
      console.error("Edit error details:", err.response);
      alert("Edit failed!");
    }
  }

  // 🔥 Professional Delete Logic
  const deleteNote = async (id) => {
    if (window.confirm("Want to delete this Note?")) {
      try {
        await axios.delete(`${API_BASE}/api/notes/${id}`);
        setNotes(notes.filter(n => n.id !== id)); // Local state update (Fast UI)
      } catch (err) {
        console.error("Delete error details:", err.response);
        alert("Delete failed! Check if backend has Delete method.");
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: "40px" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>📝 Notepad Pro</h2>
        
        <textarea 
          placeholder="Apna note likho..."
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          style={{ width: "100%", height: "80px", marginBottom: "10px", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}
        />
        
        <button 
          onClick={saveNote} 
          disabled={loading}
          style={{ width: "100%", padding: "10px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          {loading ? "Saving..." : "Save Note"}
        </button>

        {/* Edit/Delete per note */}

        <div style={{ marginTop: "20px" }}>
          {notes.length === 0 && <div style={{ color: '#666', textAlign: 'center', padding: '10px' }}>No notes yet</div>}
          {notes.map((n) => (
            <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "#f9fafb", borderBottom: "1px solid #eee", marginBottom: "5px" }}>
              <span style={{ color: "#444", flex: 1, marginRight: '10px' }}>{n.content}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    const newContent = prompt('Edit note:', n.content || '');
                    if (newContent !== null) {
                      editNote(n.id, newContent);
                    }
                  }}
                  style={{ backgroundColor: '#4548ed', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteNote(n.id)} 
                  style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;