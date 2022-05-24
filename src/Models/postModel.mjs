import mongoose from 'mongoose';

const userPost = new mongoose.Schema({
    // _id is auto generated
    user_id: String, // 1234, id of the user
    content: String, // "hello world" 
},
{
    timestamps: {
    createdAt: 'created_time',
    updatedAt: 'updated_time'
  }
});

export const UserPost = mongoose.model('Post', userPost);