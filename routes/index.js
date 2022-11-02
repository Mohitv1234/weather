var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModal = require('./users')
const say = require('say')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login2', function (req, res) {  
  res.render('sigup')
})
router.get('/logout', function (req, res) {
  req.logOut(function (err) {
    if (err) throw err;
    res.redirect('/login2');
  })
})
router.post('/register', function (req, res, next) {
  var newuser = new userModal({
    username: req.body.username,
    email: req.body.email,
  })
  userModal.register(newuser, req.body.password)
    .then(function (user) {
      passport.authenticate("local")(req, res, function () {
        res.redirect('/')
      })
    })
});
var forecastdata;
router.post('/sandforecast', function(req, res){
  forecastdata = req.body.data
})
router.get('/forecast', islogin,function(req, res){
  res.render('forecast', {data:forecastdata})
})
router.get('/profile' ,async function(req, res){
  var loginuser = await userModal.findOne({username:req.session.passport.user})
  res.render('profile',{user:loginuser})
})
router.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login2'
}), function (req, res) { });

 

router.post('/speak', islogin,function(req, res){
  let text = req.body.text
  let voice 
  let speed = .75
  say.speak(text, voice, speed, (error) => {
    if (error) {
      return console.error('Error speaking!', error)
    }
  })
  res.json('done')
}) 



  
router.post('/email/sent' ,islogin, async function(req, res){
  var user = await userModal.findOne({username: req.session.passport.user})
 var email = `${user.email}`
 authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET,
  REDIRECT_URI);
  authClient.setCredentials({refresh_token: REFRESH_TOKEN});
 var wethdata = req.body.data
  mailer(wethdata, email).then(function(rs){
    console.log(rs);
  })
})

module.exports = router;
function islogin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login2')
  }
}







const nodemailer = require("nodemailer");
const googleApis = require("googleapis");
const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `986339955722-7o4tpddht07cq1i9a9od4r65mnehkmuk.apps.googleusercontent.com`;
const CLIENT_SECRET = `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`;
const REFRESH_TOKEN = `1//04H1ajUwWHeJ3CgYIARAAGAQSNwF-L9Ir4exLFnF47ALOfLhOD9C8ilFPJByYaQzFhrefzlwBiXFjAn6uqb7ugJKXj5W3C3PDJeE`;
let authClient ;
async function mailer(data, email){
 try{
 const ACCESS_TOKEN = await authClient.getAccessToken();
 const transport = nodemailer.createTransport({
 service: "gmail",
 auth: {
 type: "OAuth2",
 user: `mohitvish95@gmail.com`,
 clientId: CLIENT_ID,
 clientSecret: CLIENT_SECRET,
 refreshToken: REFRESH_TOKEN,
 accessToken: ACCESS_TOKEN
 }
 })
 const details = {
 from: "admin name <anandprakash9155@gmail.com>",
 to: email,
 subject: "kuchh bhi likh do",
 text: "message text",
 html: `
 <div class="wrapper" style="font-size: 16px; height: 50vh; width: 80vw; background-color: #f8f8f8; display: flex; justify-content: center; align-items: center;">
     <div class="weather" style="position: relative;background-color: #fff; padding: 45px 30px 30px 30px; box-shadow: 0 0 15px rgba(156, 87, 87, 0.527); font-family: 'Bitter', serif; color: #555; border-radius: 20px;">     
      <span class="weather__date">${data.location.name} &#8212; <span id="date"></span></span>
       <h1 class="weather__pretitle" style = 'font-size:2rem;'>Temparature is ${data.current.temperature}<span style="font-size: 1rem;  position:absolute; ">0</span> C</h1>
       <p class="weather__title">day is ${data.current.day}</p>
       <p class="weather__title">day type is ${data.current.skytext}</p>
       <p class="weather__title">date is ${data.current.date}</p>
     </div>
   </div>`
 }
 const result = await transport.sendMail(details);
 return result;
 }
 catch(err){
 return err;
 }
}

