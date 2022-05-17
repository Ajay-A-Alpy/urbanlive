 require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs=require('express-handlebars')
var db=require('./config/connection')
var fileUpload=require('express-fileupload')
var session=require('express-session')


var UserRouter = require('./routes/user');
var AdminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.use(logger('dev'));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.use(('/static',express.static(path.join(__dirname,'public'))))
app.use(('/images',express.static(path.join(__dirname,'public/images'))))


app.engine('hbs',hbs.engine({extname:'hbs',
helpers:{counter:(index)=>index+1,
  format: function(date){
    let string=date.toString()
     string= string.slice(0,10)
    return string },

    date:function(day){
let date=new Date(day)
return   date.toLocaleDateString()

    },
    findDisc(disc,price){
      let final=price*(100-disc)/100;
      return final
    }

},
defaultLayout:'layout',
layoutsDir:__dirname+'/views/layout',
partialsDir:__dirname+'/views/partials'}))


app.use(fileUpload());
app.use(session({secret:"key",cookie:{maxAge:600000}, resave: false,saveUninitialized: true,}))



db.connect((err)=>{
  if(err){
    console.log('connection error'+err)
  }

else{
  console.log('Database connected')
}


})
app.use('/', UserRouter);
app.use('/admin', AdminRouter);

app.use('*',(req,res)=>{
  res.render('404')
})






// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
