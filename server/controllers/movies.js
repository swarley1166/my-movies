const path = require('path')
const fs = require('fs')

const filePath = path.join(process.cwd(), '/server/movies.json')

const readFile = () => {
  const moviesJson = fs.readFileSync(filePath, 'utf-8')
  return typeof moviesJson === 'string' ? JSON.parse(moviesJson) : [...moviesJson]
}

const getMovies = () => (req, res) => {
  const movies = readFile()
  res.json(movies)
}

const addMovies = () => (req, res) => {
  const movies = readFile()
  const id = movies[movies.length - 1].id + 1
  const newMovie = { ...req.body, id }
  const newMovies = [...movies, newMovie]
  fs.writeFileSync(filePath, JSON.stringify(newMovies))
  const result = { collection: newMovies, id }
  res.json(result)
}

const updateMovies = () => (req, res) => {
  const movies = readFile()
  const idx = movies.findIndex(m => m.id === +req.params.id)
  const newMovies = [...movies.slice(0, idx), req.body, ...movies.slice(idx + 1)]
  fs.writeFileSync(path.join(process.cwd(), '/server/movies.json'), JSON.stringify(newMovies))
  res.json(newMovies)
}

const removeMovies = () => (req, res) => {
  const movies = readFile()
  const idx = movies.findIndex(m => m.id === +req.params.id)
  const newMovies = [...movies.slice(0, idx), ...movies.slice(idx + 1)]
  fs.writeFileSync(path.join(process.cwd(), '/server/movies.json'), JSON.stringify(newMovies))
  res.json(newMovies)
}

module.exports = {
  getMovies,
  addMovies,
  updateMovies,
  removeMovies
}
