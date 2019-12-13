const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000; //3000 is for localhost

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use( express.static( publicDirPath ) );

app.get('', (req, res) => {
   res.render('index', {
      title: 'Weather',
      name: 'Arash Rasteh'
   })
})

app.get('/about', (req, res) => {
   res.render('about', {
      title: 'About Me',
      name: 'Arash Rasteh'
   })
})

app.get('/help', (req, res) => {
   res.render('help', {
      title: 'Help',
      name: 'Arash Rasteh',
      helpMessage: 'This message will help you!',
   })
})

app.get('/weather', (req, res) => {
   if (!req.query.address) {
      return res.send({
         error: 'You must provide an address term'
      })
   }

   geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
      if (error) {
         return res.send({error})
      }

      forecast(latitude, longitude, (error, forecast) => {
         if (error) {
            return res.send({error})
         }

         res.send({
            forecast,
            location,
            address: req.query.address
         })
      })
   })

})

app.get('/products', (req, res) => {
   if (!req.query.search) {
      return res.send({
         error: 'You must provide a search term'
      })
   }

   console.log(req.query)
   res.send({
      products: []
   })
})

app.get('/help/*', (req, res) => {
   res.render('404', {
      title: '404',
      name: 'Arash Rasteh',
      errorMessage: 'Help article not found.'
   })
})

app.get('*', (req, res) => {
   res.render('404', {
      title: '404',
      name: 'Arash Rasteh',
      errorMessage: 'Page not found.'
   })
})

app.listen(port, () => {
   console.log('Server is up on port ' + port + '.')
})