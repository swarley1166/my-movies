const express = require('express')

const app = express()
const port = 9000

const { getMovies, addMovies, updateMovies, removeMovies } = require('./controllers/movies')

app.use(express.json({ limit: '2mb', parameterLimit: 2097152 })) // application/json parser
app.use(express.urlencoded({ extended: false, limit: '2mb', parameterLimit: 2097152 })) // application/x-www-form-urlencoded parser
app.use(express.raw({ limit: '2mb', parameterLimit: 2097152 })) // application/octet-stream parser
app.use(express.text({ limit: '2mb', parameterLimit: 2097152 }))

app.get('/', (req, res) => {
  res.end()
})

app.get('/movies', getMovies())
app.post('/movies', addMovies())
app.put('/movies/:id', updateMovies())
app.delete('/movies/:id', removeMovies())

app.listen(port, () => {
  console.log(`Server listen on port ${port}`)
})
