import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getMyRooms, createRoom } from "../api/rooms";
import { useNavigate } from "react-router-dom";
import GuestEntry from "../../components/GuestEntry";
const Home = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getMyRooms().then(res => setRooms(res.data));
    }
  }, [user]);

  const handleCreate = async () => {
    if (!roomName.trim()) return;
    const res = await createRoom(roomName);
    setRooms(prev => [...prev, res.data]);
    setRoomName("");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <GuestEntry />
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Rooms</h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {rooms.map(room => (
          <div
            key={room.roomId}
            className="bg-white/10 p-4 rounded-xl cursor-pointer hover:bg-white/20"
            onClick={() => navigate(`/rooms/${room.roomId}`)}
          >
            <h3 className="font-semibold">{room.name}</h3>
            <p className="text-sm opacity-70">{room.roomId}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/10 p-4 rounded-xl max-w-md">
        <h2 className="font-semibold mb-2">Create Room</h2>
        <input
          className="w-full p-2 rounded text-black"
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
          placeholder="Room name"
        />
        <button
          onClick={handleCreate}
          className="mt-3 w-full bg-primary py-2 rounded"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default Home;
