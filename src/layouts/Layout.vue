<template>
  <div class="absolute-fit my-layout">
    <q-layout view="hHr Lpr lFf" class="absolute-fit">
      <q-header>
        <q-toolbar>
          <q-toolbar-title>
            Vue Movies
          </q-toolbar-title>
          <q-space />
          <q-toggle size="60px" color="black" :model-value="dark" @update:model-value="toggleDarkMode" unchecked-icon="light_mode" checked-icon="dark_mode">
          <q-tooltip>{{ dark ? 'Passer au mode clair' : 'Passer au mode sombre' }}</q-tooltip>
          </q-toggle>
        </q-toolbar>
      </q-header>

      <q-page-container class="relative-position absolute-fit column" :class="{ 'bg-color-router-view': !dark }">
        <q-page class="col column">
          <router-view class="row col q-pa-md my-router-view relative-position" :class="{ 'bg-color-router-view': !dark }" v-if="loaded" />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'

import { useMoviesStore } from 'src/stores/movies'

export default {
  name: 'layout-Layout',

  setup () {
    const $moviesStore = useMoviesStore()
    const $q = useQuasar()

    onMounted(() => {
      $moviesStore.getMovies()
    })

    const loaded = computed(() => $moviesStore.loaded)
    const dark = computed(() => $q.dark.isActive)

    const toggleDarkMode = () => {
      $q.dark.toggle()
    }

    return {
      loaded,
      dark,
      toggleDarkMode
    }
  }
}
</script>

<style lang="sass">
</style>
