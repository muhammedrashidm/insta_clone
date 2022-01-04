// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connect from "../../utils/dbConnect"

export default function helloAPI(req, res) {  
let connection;
  
  async function connect() {
    if (connection.isConnected) {
        return
    }
    const db = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    connection.isConnected = db.connections[0].readyState;
    console.log(connection.isConnected);
 
}
  connect();
  
res.status(200).json({ res: connection })
}
