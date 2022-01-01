
import mongoose from 'mongoose';

import connect from '../../../../utils/dbConnect';
var Conversation = mongoose.model('Conversation');
connect();


export default async function handler(req, res) {
    const { method, body } = req;

    switch (method) {
        case 'GET':
            res.status(200).json();
            break;
        case 'POST':
            if (body.senderId && body.reciverId !== null) {

                const newConversation = new Conversation({
                    members: [body.senderId, body.reciverId],
                });

                try {

                    const savedConversation = await newConversation.save();
                    res.status(201).json({ success: true, data: savedConversation });
                    return;
                } catch (e) {
                    res.status(400).json({ message: 'Error creating conversation' });
                    return;
                }


            }
            else {
                res.status(400).json({ message: 'Error creating conversation' });
                return;
            }

        default:
            res.status(405).json({ message: 'Method not allowed' });
    }

}


// import mongoose from 'mongoose';
// const { Schema } = mongoose;

// const blogSchema = new Schema({
//     title: String, // String is shorthand for {type: String}
//     author: String,
//     body: String,
//     comments: [{ body: String, date: Date }],
//     date: { type: Date, default: Date.now },
//     hidden: Boolean,
//     meta: {
//         votes: Number,
//         favs: Number
//     }
// });