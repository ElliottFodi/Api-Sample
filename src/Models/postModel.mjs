import mongoose from 'mongoose';

const userPost = new mongoose.Schema({
    // _id is auto generated
    user_id: String, // spufflez@gmail.com, id of the user
    content: String, // "this is my first efuse post" 
},
{
    timestamps: {
    createdAt: 'created_time',
    updatedAt: 'updated_time'
  }
});

// userPost.methods.findById = function(_id){
//     return mongoose.model('Post').findById(_id)
// }

// userPost.methods.findAllByUserId = function(userID){
//     const allPosts = mongoose.model('Post').find({ userID });
//     return allPosts;
// }

// userPost.methods.updateById = function(_id, postBody){
//     const updatedPost = mongoose.model('Post').findOneAndUpdate({ _id }, {postBody}, {
//         new: true
//     });
//     return updatedPost
// }

// userPost.methods.deleteById = function(_id){
//     const deletedResponse = mongoose.model('Post').findByIdAndDelete( _id );
//     return deletedResponse
// }

export const UserPost = mongoose.model('Post', userPost);