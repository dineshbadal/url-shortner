import  app  from "./app.js";
import connectdb from "./config/db.js";
import dns from "dns";



dns.setServers(["8.8.8.8", "1.1.1.1"]);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT} http://localhost:${PORT}`)
  connectdb();
})
