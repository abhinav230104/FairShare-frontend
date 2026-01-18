import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GuestEntry = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  return (
    <div className="bg-white/10 p-6 rounded-xl max-w-sm w-full">
      <h2 className="text-xl font-semibold mb-4">Enter as Guest</h2>
      <input
        className="w-full p-2 rounded text-black"
        placeholder="Room ID"
        value={roomId}
        onChange={e => setRoomId(e.target.value)}
      />
      <button
        onClick={() => navigate(`/guest/${roomId}`)}
        className="mt-3 w-full bg-secondary py-2 rounded"
      >
        Enter Room
      </button>
    </div>
  );
};

export default GuestEntry;
