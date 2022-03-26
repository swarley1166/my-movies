import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

import { movies } from '../services'

export const useMoviesStore = defineStore('movies', {
  state: () => ({
    collection: [],
    genres: [],
    edited: {
      id: null,
      title: null,
      year: null,
      runtime: null,
      genres: [],
      director: null,
      actors: null,
      plot: null,
      posterUrl: null
    },
    loaded: false,
    alpha: LocalStorage.has('sort_alpha') ? LocalStorage.getItem('sort_alpha') : true,
    numeric: LocalStorage.has('sort_numeric') ? LocalStorage.getItem('sort_numeric') : false
  }),
  actions: {
    async getMovies () {
      const res = await movies.get()
      this.collection = res.data
      res.data.forEach(d => {
        d.genres.forEach(g => {
          if (!this.genres.find(tg => tg.label === g)) this.genres.push({ label: g, value: g })
        })
      })
      this.genres.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1)
      this.loaded = true
    },
    close () {
      this.edited = {
        id: null,
        title: null,
        year: null,
        runtime: null,
        genres: [],
        director: null,
        actors: null,
        plot: null,
        posterUrl: null
      }
    },
    async create () {
      const res = await movies.add(this.edited)
      this.collection = res.data.collection
      return res.data.id
    },
    async update () {
      const res = await movies.update(this.edited)
      this.collection = res.data
    },
    async remove (payload) {
      const res = await movies.remove(payload)
      this.collection = res.data
      this.close()
    }
  }
})
