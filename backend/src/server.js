import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";


const PORT = process.env.PORT || 5000;

import http from "http";
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

