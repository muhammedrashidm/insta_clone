import mongoose from 'mongoose';
import connect from "../../../../utils/dbConnect";

var Message = require('../../../../models/Message')
connect();

export default async function handler(req, res) {
    const { method, body } = req;
    const { conversationId, senderId, text } = body;
    switch (method) {
        case "GET":
            res.status(404).json({ "methid": "GET not allowed" });
            break;
        case "POST":
            if (body.conversationId) {
                console.log('new message body' + JSON.stringify(body));
                const newMessage = new Message({
                    conversationId: conversationId,
                    senderId: senderId,
                    text: text
                });

                try {
                    const savedMessage = await newMessage.save();
                    res.status(201).json({ success: true, data: savedMessage });
                } catch (error) {
                    res.status(400).json({ "error": error.message });
                }
            }
    }

}
