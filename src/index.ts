import app from "./app";
import { connect } from "./db/conn.db";

app.listen(8080, async ()=>{
    await connect();
    console.log("database connected");
    console.log("server listening on port 8080");
})