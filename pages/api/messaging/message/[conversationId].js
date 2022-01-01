import mongoose from 'mongoose';
import connect from '../../../../utils/dbConnect';

var Message = require('../../../../models/Message');

connect();
export default async function handler(req, res) {
    const { method, query: { conversationId } } = req;

    switch (method) {
        case 'GET':
            if (conversationId !== undefined) {


                try {

                    let messages = await Message.find({
                        conversationId: conversationId
                    });



                    if (messages.length > 0) {

                        res.status(200).json({ success: true, data: messages });
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

