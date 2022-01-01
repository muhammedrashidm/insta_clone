import mongoose from 'mongoose';
import connect from '../../../../../../utils/dbConnect';

var Conversation = mongoose.model('Conversation');



connect();

export default async (req, res) => {

    const { method, query: { firstUserId, secondUserId } } = req;


    if (method === 'GET') {

        try {
            const conversation = await Conversation.findOne({
                members: { $all: [firstUserId, secondUserId] }
            });
            res.status(200).json({ success: true, data: conversation });
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(405).send({ err: 'Method not allowed' });
    }

}
