const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/codeial_development');
const db=mongoose.connection;
db.on ('error',console.error.bind(console,"ERROR connection to mongoDB"));
db.once('open',function(){
    console.log('connection to Database ::MongoDB');
});
module.exports=db;