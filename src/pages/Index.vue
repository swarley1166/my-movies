<template>
  <div class="row col">
    <!-- LIST -->
    <div class="column full-height rounded-borders" style="width: 400px">
      <div class="column bg-white">
        <q-input outlined dense placeholder="Rechercher" class="q-ma-sm" v-model="filter" clearable @update:model-value="savefilter($event)">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <div class="row">
          <q-btn round flat dense :color="alpha ? 'primary' : 'black'" :icon="alpha ? 'mdi-sort-alphabetical-ascending' : 'mdi-sort-alphabetical-descending'" @click="order('alpha')" />
          <q-btn round flat dense :color="numeric ? 'primary' : 'black'" :icon="numeric ? 'mdi-sort-numeric-ascending' : 'mdi-sort-numeric-descending'" @click="order('numeric')" />
        </div>
      </div>
      <q-list class="col full-width scroll" v-if="movies && movies.length">
        <q-item clickable class="rounded-borders bg-white q-mb-sm q-mx-sm" style="height: 80px" v-for="(movie, idx) in movies" :key="idx" @click="select(movie)" :class="{ 'selected': edited === movie.id }">
          <q-item-section avatar>
            <q-img :src="movie.posterUrl" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-bold">{{ movie.title }} - {{ movie.year }}</q-item-label>
            <q-item-label caption>{{ movie.director }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-btn round flat icon="delete" color="negative" @click.stop="remove(movie)" v-if="movie.id" />
          </q-item-section>
        </q-item>
      </q-list>
      <div class="col column items-center justify-center q-pa-md text-bold">
        Il n'y a pas de film dans la liste
      </div>
      <div class="row q-pa-sm">
        <q-btn dense no-caps color="primary" class="col" label="Ajouter un film" @click="add" />
      </div>
    </div>
    <!-- DETAIL -->
    <div class="column col q-ml-md">
      <router-view />
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { orderBy } from 'lodash'

import { useMoviesStore } from 'src/stores/movies'
import { filterFormatter } from 'src/functions.js'

export default {
  name: 'pages-Index',

  setup () {
    const $moviesStore = useMoviesStore()
    const $router = useRouter()
    const $q = useQuasar()

    const filter = ref($q.localStorage.has('filter') ? $q.localStorage.getItem('filter') : '')
    const alpha = computed(() => $moviesStore.alpha)
    const numeric = computed(() => $moviesStore.numeric)
    const edited = computed(() => $moviesStore.edited.id)

    const movies = computed(() => {
      const filtered = []
      const alphaSort = $moviesStore.alpha
      const numericSort = $moviesStore.numeric
      if (filter.value) {
        const sanfilter = filterFormatter(filter.value)
        $moviesStore.collection.forEach(m => {
          const title = filterFormatter(m.title)
          const year = m.year
          const director = filterFormatter(m.director)
          if (title.includes(sanfilter) || year.includes(filter.value) || director.includes(sanfilter)) filtered.push(m)
        })
        if (alphaSort && !numericSort) return orderBy(filtered, ['title'], ['asc'])
        if (!alphaSort && numericSort) return orderBy(filtered, ['year'], ['asc'])
        if (alphaSort && numericSort) return orderBy(filtered, ['year', 'title'], ['asc', 'asc'])
        return filtered
      }
      if (alphaSort && !numericSort) return orderBy($moviesStore.collection, ['title'], ['asc'])
      if (!alphaSort && numericSort) return orderBy($moviesStore.collection, ['year'], ['asc'])
      if (alphaSort && numericSort) return orderBy($moviesStore.collection, ['year', 'title'], ['asc', 'asc'])
      return $moviesStore.collection
    })

    const select = (movie) => {
      $router.push({ name: 'movies-edit', params: { id: movie.id } })
    }

    const add = () => {
      $router.push({ name: 'movies-create' })
    }

    const remove = (movie) => {
      $q.dialog({
        title: 'Suppression d\'un film',
        message: `Etes-vous sûr de vouloir supprimer le film "${movie.title}"`,
        ok: 'Oui',
        cancel: 'Non'
      }).onOk(async () => {
        await $moviesStore.remove({ id: movie.id })
        $router.push({ name: 'movies' })
      })
    }

    const order = (attr) => {
      $moviesStore[attr] = !$moviesStore[attr]
      $q.localStorage.set(`sort_${attr}`, $moviesStore[attr])
    }

    const savefilter = (value) => {
      $q.localStorage.set('filter', value)
    }

    return {
      alpha,
      filter,
      movies,
      numeric,
      edited,
      add,
      order,
      remove,
      savefilter,
      select
    }
  }
}
</script>
