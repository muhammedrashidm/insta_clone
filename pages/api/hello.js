// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connect from "../../utils/dbConnect"
export default function helloAPI(req, res) {
    connect();
  res.status(200).json({ name: 'John Doe' })
}
