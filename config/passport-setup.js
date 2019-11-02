const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-models')

passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null, user);
    })
   
});


passport.use(
    new GoogleStrategy({
    //options for the google strat
    callbackURL:'/auth/google/redirect',
    clientID:keys.google.clientId,
    clientSecret:keys.google.clentSecret
},(accessToken,refreshToken,profile,done)=>{
//passort caalback function
// console.log('passport callback function fire');
// console.log(profile);
// console.log(profile.id);
// console.log(profile.displayName);

//check if user already existed
User.findOne({googleId:profile.id}).then((currentUser)=>{
if(currentUser){
    //already exits

    console.log('user is ',currentUser);

    // console.log(gid);
    done(null, currentUser);
    }else{
        //if not crate user in db
        let user = new User({
        username: profile.displayName, 
        googleId: profile.id,
        thumbnail:profile._json.picture,
        item:"",
        describe:"",
        techStack:"",
        approve:"PENDING"
        });
        user.save().then(function(newUser){
        console.log('data added ', JSON.stringify(newUser));
        console.log(profile.displayName);
        done(null, newUser); 
        // const todouser = function(){
        //     const gid = profile.id;
        // }
        // module.exports = todouser;
        // console.log(gid);
        
        })
    }
});
})
);

