const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const config = require('./config/key')
const app = express()

// ***********************************************************************
// GO INTO ./config/dev.js AND PUT UR MONGOURI
// ***********************************************************************
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// set view engine to ejs file type
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// route that returns index.ejs file to display
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  // check and see if inputted url already exists in db
  const exist = await ShortUrl.findOne({ full: req.body.fullUrl })
  // if it does exist, just go back to home
  if (exist) {
    res.redirect('/').send({ alreadyExists: true, createSuccess: false })
  }
  // if it does not exist, create new
  await ShortUrl.create({ full: req.body.fullUrl })
  // go back to home
  res.redirect('/').send({ alreadyExists: false, createSuccess: true })
})

// handle delete req. that is received whenever any trash button is clicked
app.delete('/delete/:shortUrl', async (req, res) => {
  // find and remove URL data on db that matches received :shortUrl
  ShortUrl.findOneAndDelete({ short: req.params.shortUrl }, function (err, result) {
    if (err) {
        console.log(err)
    }
    else{
        console.log("Deleted URL : ", result.full);
        res.redirect('/')
    }
  })
})
// finds shortURL clicked and opens full URL website, updates clicks
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000)