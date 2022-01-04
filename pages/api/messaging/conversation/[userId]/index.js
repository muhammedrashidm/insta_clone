import mongoose from 'mongoose';
import connect from '../../../../../utils/dbConnect';

var Conversation = require('../../../../../models/Conversation');
connect();
export default async function handler(req, res) {
    const { method, query: { userId } } = req;

    switch (method) {
        case 'GET':
            if (userId !== undefined) {

                try {

                    let conversation = await Conversation.find({
                        members: { $in: [userId] }
                    });



                    if (conversation.length > 0) {

                        res.status(200).json({ success: true, data: conversation });
                    } else {
                        console.log('not found');
                        res.status(400).json({ success: false });
                    }
                } catch (error) {
                    res.status(500).send(error);
                }
            } else {
                res.status(400).send('Bad request');
            }
            break;
        case 'POST':
            res.status(405).json('method not allowed');
    }

}

