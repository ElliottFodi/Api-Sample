import mongoose from 'mongoose';

const userComment = new mongoose.Schema({
    // _id is auto generated
    post_id: String, // unique ID of the post that this comment belongs to 
    user_id: String, // 1234, id of the user
    content: String, // "hello world comment" 
},
{
    timestamps: {
    createdAt: 'created_time',
    updatedAt: 'updated_time'
  }
});

export const UserComment = mongoose.model('Comment', userComment);