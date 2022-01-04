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
// =======================================================
// import mongoose from 'mongoose';
// var Schema = mongoose.Schema;

// const ConversationSchema = new Schema(
//     {
//         members: {
//             type: Array,
//             required: true
//         }
//     },

//     { timestamps: true }
// );


// mongoose.models = {};

// var Conversation = mongoose.model('Conversation', ConversationSchema);

// export default Conversation;