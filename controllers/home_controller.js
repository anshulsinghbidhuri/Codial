const Post=require('../models/posts');
const User=require('../models/user');
module.exports.home=async function(req,res){

    
    try{
    //populare the user for each post
    let post=await Post.find({}) 
    .sort('-createdAt')
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user'
        },
        populate: {
            path: 'likes'
        }
    }).populate('comments')
    .populate('likes');
    
    let users=await User.find({});
        return res.render('home',{
            title:"codeial|Home",
            posts:post,
            all_users:users
        });
    }catch(err){
        console.log('Error',err);
        return;
    }
}