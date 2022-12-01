// server file
const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const port=8000;
const expresslayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
//used for the seeion cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy')
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo');
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');
// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'expanded',
    prefix:'/css'

}));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));
//make the upload path available to the browser
app.use('/upload',express.static(__dirname+'/upload'));
app.use(expresslayouts);

// external style and scripts and sub page into a layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//set up the Views Engine
app.set('view engine','ejs');
app.set('views','./views');


app.use(session({
    name:'codeial',
    //todo change the secret before deployment in the production mode
    secret:'blahsomthing',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/codeial_development',
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup is ok')
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
//use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error in the running server:${err}`);
    }
    console.log(`server is running in the port:${port}`);
});