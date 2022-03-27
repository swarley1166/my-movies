<template>
  <div class="absolute-fit my-layout">
    <q-layout view="hHr Lpr lFf" class="absolute-fit">
      <q-header>
        <q-toolbar>
          <q-toolbar-title>
            Vue Movies
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container class="relative-position absolute-fit column bg-color-router-view">
        <q-page class="col column">
          <router-view class="row col q-pa-md bg-color-router-view my-router-view relative-position" v-if="loaded" />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
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

<style lang="sass">
</style>
