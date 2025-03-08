// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Fixed: JavaScript Object Syntax (No Double Quotes in Keys)
const floorPlanData = {
  rooms: [
    {
      id: 1,
      name: "Living Room",
      width: 400,
      height: 300,
      x: 0,
      y: 0,
      doors: [
        {
          x: 175,
          y: 300,
          width: 50
        }
      ],
      windows: [
        {
          x: 380,
          y: 50,
          width: 60
        }
      ]
    },
    {
      id: 2,
      name: "Bedroom",
      width: 300,
      height: 300,
      x: 400,
      y: 0,
      doors: [
        {
          x: 125,
          y: 300,
          width: 50
        }
      ],
      windows: [
        {
          x: 280,
          y: 50,
          width: 60
        }
      ]
    }
  ]
};

// API Endpoint to get floor plan data
app.get("/api/floorplan", (req, res) => {
  res.json(floorPlanData);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
