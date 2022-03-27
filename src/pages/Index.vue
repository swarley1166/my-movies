<template>
  <div>
    <!-- LIST -->
    <div class="column full-height rounded-borders" style="width: 400px">
      <div class="column bg-white">
        <q-input outlined dense placeholder="Rechercher" class="q-ma-sm" v-model="filter" clearable @update:model-value="savefilter($event)">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <div class="row">
          <q-btn round flat dense :color="moviesStore.alpha ? 'primary' : 'black'" :icon="'mdi-sort-alphabetical-ascending'" @click="order('alpha')" />
          <q-btn round flat dense :color="moviesStore.numeric ? 'primary' : 'black'" :icon="'mdi-sort-numeric-ascending'" @click="order('numeric')" />
        </div>
      </div>

      <q-virtual-scroll class="col full-width scroll" :virtual-scroll-item-size="80" :virtual-scroll-sticky-size-start="80" :items="movies" v-if="movies && movies.length > 0">
      <template v-slot="{ item: movie, index: idx }">
        <q-item :id="`movie_${movie.id}`" clickable class="rounded-borders bg-white q-mb-sm q-mx-sm" style="height: 80px" :key="idx" @click="select(movie)" :class="{ 'selected': moviesStore.edited.id === movie.id }">
          <q-item-section avatar>
            <q-img :src="movie.posterUrl || moviesStore.defaultPoster" :placeholder-src="moviesStore.defaultPoster" alt="Affiche non disponnible" />
          </q-item-section>
          <q-item-section>
            <q-item-label lines="1" class="text-bold">{{ movie.title }} - {{ movie.year }}</q-item-label>
            <q-item-label lines="1" caption>{{ movie.director }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-btn round flat icon="delete" color="negative" @click.stop="remove(movie)" v-if="movie.id" />
          </q-item-section>
        </q-item>
      </template>
      </q-virtual-scroll>
      <div class="col column items-center justify-center q-pa-md text-bold" v-else>
        Il n'y a pas de film dans la liste
      </div>
      <div class="row q-pa-sm">
        <q-btn dense no-caps color="primary" class="col" label="Ajouter un film" @click="add" />
      </div>
    </div>
    <!-- DETAIL -->
    <div class="column col full-height q-ml-md">
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

    const filter = ref($q.localStorage.has('filter') && $q.localStorage.getItem('filter') !== 'null' ? $q.localStorage.getItem('filter') : '')

    const movies = computed(() => {
      let filtered = $moviesStore.collection
      if (filter.value) {
        const sanfilter = filterFormatter(filter.value)
        filtered = $moviesStore.collection.filter(m => {
          const title = filterFormatter(m.title)
          const year = m.year
          const director = filterFormatter(m.director)
          return (title.includes(sanfilter) || year.includes(filter.value) || director.includes(sanfilter))
        })
      }
      if ($moviesStore.alpha && !$moviesStore.numeric) return orderBy(filtered, ['title'], ['asc'])
      if (!$moviesStore.alpha && $moviesStore.numeric) return orderBy(filtered, ['year'], ['asc'])
      if ($moviesStore.alpha && $moviesStore.numeric) return orderBy(filtered, ['year', 'title'], ['asc', 'asc'])
      return filtered
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
      filter,
      movies,
      moviesStore: $moviesStore,
      add,
      order,
      remove,
      savefilter,
      select
    }
  }
}
</script>
