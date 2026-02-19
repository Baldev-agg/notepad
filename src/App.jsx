import { useState, useEffect } from "react";
import axios from "axios";
// Agar Auth alag file mein hai toh import karo, varna niche hi rakho
import Auth from "./Auth"; 

function App() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  // const [email, setEmail] = useState("");

  const API_BASE = "https://localhost:7239";

  // FIX 1: Missing loginUser function jo Auth component use kar raha hai
  const loginUser = (id) => {
    localStorage.setItem("userId", id);
    setUserId(id);
  };

  const fetchNotes = async (currentUserId) => {
    // Agar userId nahi hai toh API call mat karo
    const idToUse = currentUserId || userId;
    if (!idToUse) return;

    try {
      const res = await axios.get(`${API_BASE}/api/notes?userId=${idToUse}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const saveNote = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      // FIX 2: Note ke saath UserId bhejna bahut zaroori hai
      await axios.post(`${API_BASE}/api/notes`, { 
        content: text, 
        userId: parseInt(userId) // Ensure it's a number
      });
      setText("");
      fetchNotes(userId); // Refresh list
    } catch (err) {
      alert("Save failed!");
    } finally {
      setLoading(false);
    }
  };

  const editNote = async (id, content) => {
    try {
      // FIX 3: Backend model ke hisaab se id aur userId dono bhej sakte ho
      await axios.put(`${API_BASE}/api/notes/${id}`, { 
        id: id, 
        content: content,
        userId: parseInt(userId) 
      });
      fetchNotes(userId);
    } catch (err) {
      alert("Edit failed!");
    }
  };

  const deleteNote = async (id) => {
    if (window.confirm("Want to delete this Note?")) {
      try {
        await axios.delete(`${API_BASE}/api/notes/${id}`);
        setNotes(notes.filter((n) => n.id !== id));
      } catch (err) {
        alert("Delete failed!");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    setNotes([]);
  };

  useEffect(() => {
    if (userId) {
      fetchNotes(userId);
    }
  }, [userId]);

  return (
    <>
      {!userId ? (<Auth onLoginSuccess={loginUser} />) 
      :
      (
        <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", padding: "40px" }}>
          <div style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: "#333" }}>📝 Notepad Pro</h2>
                <button onClick={handleLogout} style={{ backgroundColor: '#666', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
            </div>
            
            <textarea 
              placeholder="Write down your thoughts..."
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              style={{ width: "100%", height: "80px", marginBottom: "10px", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: 'border-box' }}
            />
            
            <button 
              onClick={saveNote} 
              disabled={loading}
              style={{ width: "100%", padding: "10px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
            >
              {loading ? "Saving..." : "Save Note"}
            </button>

            <div style={{ marginTop: "20px" }}>
              {notes.length === 0 && <div style={{ color: '#666', textAlign: 'center', padding: '10px' }}>No notes yet</div>}
              {notes.map((n) => (
                <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "#f9fafb", borderBottom: "1px solid #eee", marginBottom: "5px" }}>
                  <span style={{ color: "#444", flex: 1, marginRight: '10px' }}>{n.content}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        const newContent = prompt('Edit note:', n.content || '');
                        if (newContent !== null && newContent.trim() !== "") {
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
      )}
    </>
  );
}

export default App;