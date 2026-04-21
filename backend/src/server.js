import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();
console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
