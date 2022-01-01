import { Schema, model } from "mongoose";

const ConversationSchema = new Schema(
    {
        members: {
            type: Array,
            required: true
        }
    },

    { timestamps: true }
);
let Conversation
try {
    Conversation = model('Conversation')
} catch (error) {
    Conversation = model('Conversation', ConversationSchema)
}
module.exports = Conversation

