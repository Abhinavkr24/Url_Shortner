const express = require('express')
const path = require('path')
const {connectToMongoDb} = require('./connect')
const cookieParser = require('cookie-parser')
const {restrictToLoggedInUserOnly,checkAuth} = require('./middlewares/auth')
const URL = require('./models/url')

const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')

const app = express();
const PORT = 8001;

connectToMongoDb("mongodb://localhost:27017/short_url")
.then(()=>{console.log("mongodb connected")});

app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

app.use('/url',restrictToLoggedInUserOnly,urlRoute);
app.use('/user',userRoute);
app.use('/',checkAuth,staticRoute);



app.get("/api/url/:shortId",async(req,res)=>{
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate({
     shortId
  },{$push:{
    visitHistory:{
      timestamp:Date.now(),
  },}
})
  res.redirect(entry.redirectURL);
})

app.listen(PORT,()=>{console.log(`server started at :${PORT}`)});