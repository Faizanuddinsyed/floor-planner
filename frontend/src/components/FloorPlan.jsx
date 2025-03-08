// const Room = ({ room, moveRoom, updateRoomSize }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: "ROOM",
//     item: { id: room.id },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const [{ isOver }, drop] = useDrop({
//     accept: "ROOM",
//     drop: (item) => moveRoom(item.id, room.id),
//     collect: (monitor) => ({
//       isOver: monitor.isOver(),
//     }),
//   });

//   return (
//     <div
//       ref={(node) => drag(drop(node))}
//       className={`relative flex items-center justify-center border-2 ${
//         isDragging ? "opacity-50" : "opacity-100"
//       } ${isOver ? "bg-blue-300" : "bg-white"}`}
//       style={{
//         width: `${room.width}px`,
//         height: `${room.height}px`,
//         position: "relative",
//       }}
//     >
//       <p className="text-sm font-bold">{room.name}</p>

//       {/* 🔵 Doors - Map through all doors in the room */}
//       {room.doors &&
//         room.doors.map((door, index) => (
//           <div
//             key={index}
//             className="absolute bg-blue-500 w-10 h-3 rounded"
//             style={{
//               top: `${door.y}px`,
//               left: `${door.x}px`,
//               width: `${door.width}px`,
//               transform: "translate(-50%, -50%)",
//             }}
//           ></div>
//         ))}

//       {/* 🟢 Windows - Map through all windows in the room */}
//       {room.windows &&
//         room.windows.map((window, index) => (
//           <div
//             key={index}
//             className="absolute bg-green-400 w-16 h-3 rounded"
//             style={{
//               top: `${window.y}px`,
//               left: `${window.x}px`,
//               width: `${window.width}px`,
//               transform: "translate(-50%, -50%)",
//             }}
//           ></div>
//         ))}

//       {/* 📏 Resize Controls */}
//       <div className="absolute bottom-0 left-0 p-1 bg-gray-100 border">
//         <input
//           type="number"
//           className="w-12 p-1 text-xs"
//           value={room.width}
//           onChange={(e) => updateRoomSize(room.id, "width", e.target.value)}
//         />
//         x
//         <input
//           type="number"
//           className="w-12 p-1 text-xs"
//           value={room.height}
//           onChange={(e) => updateRoomSize(room.id, "height", e.target.value)}
//         />
//       </div>
//     </div>
//   );
// };




import React, { useState, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Room = ({ room, moveRoom, updateRoomSize }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ROOM",
    item: { id: room.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "ROOM",
    drop: (item) => moveRoom(item.id, room.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative flex items-center justify-center border-2 ${
        isDragging ? "opacity-50" : "opacity-100"
      } ${isOver ? "bg-blue-300" : "bg-white"}`}
      style={{
        width: `${room.width}px`,
        height: `${room.height}px`,
        position: "relative",
      }}
    >
      <p className="text-sm font-bold">{room.name}</p>

      {/* 🔵 Doors */}
      {room.doors?.map((door, index) => (
        <div
          key={index}
          className="absolute bg-blue-500 h-6 rounded"
          style={{
            width: `${door.width}px`,
            top: `${door.y}px`,
            left: `${door.x}px`,
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      ))}

      {/* 🟢 Windows */}
      {room.windows?.map((window, index) => (
        <div
          key={index}
          className="absolute bg-green-400 h-4 rounded"
          style={{
            width: `${window.width}px`,
            top: `${window.y}px`,
            left: `${window.x}px`,
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      ))}

      {/* 📏 Resize Controls */}
      <div className="absolute bottom-0 left-0 p-1 bg-gray-100 border">
        <input
          type="number"
          className="w-12 p-1 text-xs"
          value={room.width}
          onChange={(e) => updateRoomSize(room.id, "width", parseInt(e.target.value))}
        />
        x
        <input
          type="number"
          className="w-12 p-1 text-xs"
          value={room.height}
          onChange={(e) => updateRoomSize(room.id, "height", parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

const FloorPlan = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/floorplan")
      .then((response) => response.json())
      .then((floorPlanData) => {
        if (floorPlanData && Array.isArray(floorPlanData.rooms)) {
          setData(floorPlanData);
        } else {
          setData({ rooms: [] });
        }
      })
      .catch((error) => {
        console.error("Error fetching floor plan:", error);
        setData({ rooms: [] });
      });
  }, []);

  const moveRoom = (draggedId, targetId) => {
    const updatedRooms = [...data.rooms];
    const draggedIndex = updatedRooms.findIndex((r) => r.id === draggedId);
    const targetIndex = updatedRooms.findIndex((r) => r.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      [updatedRooms[draggedIndex], updatedRooms[targetIndex]] = [
        updatedRooms[targetIndex],
        updatedRooms[draggedIndex],
      ];
      setData({ ...data, rooms: updatedRooms });
    }
  };

  const updateRoomSize = (roomId, field, value) => {
    const updatedRooms = data.rooms.map((room) =>
      room.id === roomId ? { ...room, [field]: parseInt(value) } : room
    );
    setData({ ...data, rooms: updatedRooms });
  };

  if (!data) {
    return <p>Loading floor plan...</p>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-4">🏠 Floor Plan</h2>

        <div className="w-[800px] h-[500px] border-4 border-gray-700 grid grid-cols-2 gap-2 p-4 bg-gray-200">
          {data.rooms.map((room) => (
            <Room
              key={room.id}
              room={room}
              moveRoom={moveRoom}
              updateRoomSize={updateRoomSize}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default FloorPlan;
