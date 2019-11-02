const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const assert = require('assert');
const User = require('./models/user-models')
const keys = require('./config/keys');
const app = express();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
const cookieSession = require('cookie-session');
const passport = require('passport');
//set up an view engine
app.set('view engine','ejs');
let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended:true});
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys: [keys.session.cookieKey]
}));
app.use(express.static('./public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

//initialise passport
app.use(passport.initialize());
app.use(passport.session());

//connect to mongdb
mongoose.connect('mongodb://localhost/testaroo',()=>{
    console.log('connected to mongodb');
    
}) 
var todoSchema = new mongoose.Schema({
    item:String
})

var Todo = mongoose.model('Todo', todoSchema);

//set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.post('/addidea', function(req, res){
res.render('work');
})


//create home route
app.get('/',function(req,res){
    res.render('home',{user: req.user});
    
})

app.get('/profile/todo', function(req, res){
    //get data from mongodb and pass to view
    User.find({}, function(err, data){
        if (err) throw err
        res.render('todo', {todos: data})
        console.log(data);
        
    })
    

})
app.get('/profile/idea', function(req,res){ 
    User.find({}, function(err,found){
        if(err){
            console.log(err);
            res.status(500).send();
                       
        } else{
            
            console.log(found.length);
            
            
            // console.log(found.JSON);
           const dare = found
        //    console.log(dare);
          
            // const infouser = dare[i]["username"]
            // const infoidea = dare[i]["item"]
            // const info = [infouser,infoidea]
             res.render('idea',{list:dare})
         
        }
    })
}) 
app.post('/profile/todo',urlencodedParser, function(req, res,done){
    //get data from view and add to mongodb
    // var newTodo = User(req.body).save(function(err,data){
    //     if (err) throw err
    //     res.json(data)
    // })
    const data =req.body
    console.log(data.sc);
    console.log(data.item);
    console.log(data.ts);
    
    
    
    User.findOneAndUpdate({item:""},{item:data.item}).then(function(){
       // User.findById({_id: User._id}).then(function(result){
        // res.render('/todo');
        //     assert(result.item=== JSON.stringify(data))
        //     done();
        // })
        if(User.findOne({item:data.item})){
            User.findOneAndUpdate({describe:""},{describe:data.sc}).then(function(){
                console.log('describe inserted in idea');
                
            })
            User.findOneAndUpdate({techStack:""},{techStack:data.ts}).then(function(){
                console.log('techstack inserted in idea');
                
            })
        }

        
    })
   

})
// app.post('/profile/todod',urlencodedParser, function(req, res,done){
//     //get data from view and add to mongodb
//     // var newTodo = User(req.body).save(function(err,data){
//     //     if (err) throw err
//     //     res.json(data)
//     // })
//     const data =req.body
//     var r = data
//     var peys = []
//     for (var k in r) peys.push(k);
//     console.log(peys);
    
//     // User.findOneAndUpdate({describe:""},{item:JSON.stringify(data)}).then(function(){
//     //     // User.findById({_id: User._id}).then(function(result){
//     //     // res.render('/todo');
//     //     //     assert(result.item=== JSON.stringify(data))
//     //     //     done();
//     //     // })
        
//     // })
    
    

// })

app.delete('/profile/todo/:item', function(req,res){
    //delete the request from mongodb
    User.find({item:req.params.item.replace(/\-/g," ")}).remove(function(err,data){
        if (err) throw err
        res.json(data);
        req.logout();
    })
  
})

app.get('/incharge',function(req,res){
    User.find({}, function(err,found){
        if(err){
            console.log(err);
            res.status(500).send();
                       
        } else{
            
            // console.log(found.length);
            
            
            // console.log(found.JSON);
           const dare = found
        //    console.log(dare);
          
            // const infouser = dare[i]["username"]
            // const infoidea = dare[i]["item"]
            // const info = [infouser,infoidea]
             res.render('incharge',{list:dare})
         
        }
    })
})
app.post('/incharge',urlencodedParser, function(req, res,){
    const data = req.body
    var s = data
    var keys =[];
    for (var k in s) keys.push(k);
    console.log(keys)
    User.find({item:keys}).then(function(){
        // console.log('step1 done');
        User.findOneAndUpdate({approve:"PENDING"}, {approve:"APPROVED"}).then(function(){
            console.log('idea approved check in database');
            
        })
        
    })
})
app.post('/incharger',urlencodedParser, function(req, res,){
    const data = req.body
    var s = data
    var keys =[];
    for (var k in s) keys.push(k);
    console.log(keys)
    User.find({item:keys}).then(function(){
        // console.log('step1 done');
        User.findOneAndUpdate({approve:"PENDING"}, {approve:"REJECTED"}).then(function(){
            console.log('idea approved check in database');
            
        })
        
    })
})

app.get('/approvedideas',function(req,res){
    User.find({}, function(err,found){
        if(err){
            console.log(err);
            res.status(500).send();
                       
        } else{
            
            // console.log(found.length);
            
            
            // console.log(found.JSON);
           const dare = found
        //   console.log(dare);
          
            // const infouser = dare[i]["username"]
            //const infoidea = dare[i]["approve"]
            // const info = [infouser,infoidea]
             res.render('approvedideas',{list:dare})
         
        }
    })
})

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads');

    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-'+ Date.now() + path.extname(file.originalname)); 
    }
})

var upload = multer({
    storage:storage
})

app.get('/uploading', function(req,res){
    res.sendFile(__dirname+'/uploading.html')
})

app.post('/uploadFile',upload.single('myFile'),(req,res,next) =>{
    const file = req.file;
    if(!file){
        const error = new Error('please upload the file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);
    
})

fs.readFile('./uploads',function(err,data){
    console.log(data);
    
})
app.get('/viewfile',function(req,res){
    res.render('viewfile')
})
app.listen(3000,()=>{
    console.log('server working');
    // console.log(gid)
});