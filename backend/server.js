require("dotenv").config();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); // Node 18+ — Railway containers lack outbound IPv6
const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});