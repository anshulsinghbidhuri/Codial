const User=require('../models/user');
const fs=require('fs');
const path=require('path');

module.exports.profile = function(req, res){
     User.findById(req.params.id, function(err, user){
         return res.render('user_profile', {
             title: 'User Profile',
             profile_user: user
         });
     });

 }
 
 module.exports.update =async function(req, res){
     if(req.user.id == req.params.id){
          try{
               let user=await User.findById(req.params.id);
               User.uploadedAvatar(req,res,function(err){
                    if(err){
                         console.log('*****Multer Error:',err)}
                         user.name=req.body.name;
                         user.email=req.body.email;
                         if(req.file){

                              if(user.avatar){
                                   fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                                   // if (fs.existsSync(path.join(__dirname, '..', user.avatar))) {

                                   //  }
                              }
                              user.avatar=User.avatarPath +'/'+ req.file.filename;
                         }
                         user.save();
                         req.flash("success in the upload")
                         return res.redirect('back');
                    
               });
          }catch(err){
               req.flash('error',err);
               return res.redirect('back');
               }

          
     //     User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
     //         return res.redirect('back');
     //     });
     }else{
         return res.status(401).send('Unauthorized');
     }
}
// module.exports.profile=function(req,res){
//      if(req.cookies.user_id){
//           User.findById(req.cookies.user_id,function(err,user){
//                if(user){
//                     return res.render('user_profile',{
//                          title:'User_profile',
//                          user:user
//                     });
//                }else{
//                     return res.redirect('/users/sign-in');
//                }
//           });
//      }else{
//           return res.redirect('/users/sign-in');
//      }
//      }
module.exports.signUp=function(req,res){
     if(req.isAuthenticated()){
          return res.redirect('/users/profile');
     }
     return res.render('user_sign_up',{
          title:'codeial|sign Up'
     });
}
module.exports.signIn=function(req,res){
     if(req.isAuthenticated()){
         return res.redirect('/users/profile');
     }
     return res.render('user_sign_in',{
          title:'codeial|sign In'
     });
}
// get the sign up data
module.exports.create=function(req,res){
     console.log(req.body);
    if(req.body.password!=req.body.confirm_password){
     console.log('line 21');
     return res.redirect('back');
    }
    User.findOne({email:req.body.email},function(err,user){
     if(err){console.log('error is finding user in signing up',err);return}
     
     if(!user){
          User.create(req.body,function(err,user){
               console.log('line 29');
               if(err){console.log('error is creating user while signng up',err);return}
               return res.redirect('/users/sign-in');
          });
     }else{
          console.log('line 34');
          return res.redirect('back');
     }
    });
}

// get the sign up data
module.exports.createsession=function(req,res){
     req.flash('success', 'Logged in Successfully');
     return res.redirect('/');
}
     //step to Authentication
     //find the user
//      User.findOne({email:req.body.email},function(err,user){
//           if(err){console.log('error is findinguser in sign in',err);return}
//           console.log('line 46');
//           //handle user found 
//           if(user){
//                //handle password which is donesn't match
//                if(user.password!=req.body.password){
//                     console.log('line 51');
//                     return res.redirect('back');
//                }
//                //handle session creation
//                res.cookie('user_id',user.id);
//                return res.redirect('/users/profile');
//           }else{
//                //handle user not found 
//                console.log('line 59');
//                return res.redirect('back');
//           }
//      });
// }
module.exports.destroySession = function(req, res){
     req.logout(function(err){if(err){console.log('err',err)}
     req.flash('success', 'You have logged out!');
     return res.redirect('/');
});
 }