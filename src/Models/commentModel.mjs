// import { ObjectId } from 'bson';
import mongoose from 'mongoose';

const userComment = new mongoose.Schema({
    // _id is auto generated
    post_id: String, // unique ID of the post that this comment belongs to 
    user_id: String, // spufflez@gmail.com, id of the user
    content: String, // "this is my first efuse post" 
},
{
    timestamps: {
    createdAt: 'created_time',
    updatedAt: 'updated_time'
  }
});

// userComment.methods.findById = function(_id){
//     return mongoose.model('Comment').findById(_id)
// }

// userComment.methods.findAllById = function(userID){
//     const allComments = await mongoose.model('Comment').find({ userID });
//     return allComments;
// }

// userComment.methods.updateById = function(_id, commentBody){
//     const updatedComment = await mongoose.model('Comment').findOneAndUpdate({ _id }, {commentBody}, {
//         new: true
//     });
//     return updatedComment
// }

// userComment.methods.deleteById = function(_id){
//     const deletedResponse = await mongoose.model('Comment').findByIdAndDelete(_id );
//     return deletedResponse
// }

export const UserComment = mongoose.model('Comment', userComment);