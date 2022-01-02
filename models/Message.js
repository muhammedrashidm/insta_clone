import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
    {
        conversationId: {
            type: String,
            required: true,

        },
        senderId: {
            type: String,
            required: true,
        },
        text: {
            type: String
        }
    },

    { timestamps: true }
);
let Message
try {
    Message = model('Message')
} catch (error) {
    Message = model('Message', MessageSchema)
}
module.exports = Message

