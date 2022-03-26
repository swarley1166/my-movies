<template>
  <q-layout view="lHh Lpr lFf" class="absolute-fit">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Vue Movies
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="relative-position absolute-fit column" style="background-color: #F3F3F3">
      <q-page class="col column">
        <router-view class="q-pa-md col relative-position" v-if="loaded" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { onMounted, computed } from 'vue'

import { useMoviesStore } from 'src/stores/movies'

export default {
  name: 'layout-Layout',

  setup () {
    const $moviesStore = useMoviesStore()
    onMounted(() => {
      $moviesStore.getMovies()
    })

    const loaded = computed(() => $moviesStore.loaded)

    return {
      loaded
    }
  }
}
</script>
