<template>
  <q-form @submit="save">
    <div class="row rounded-borders items-center q-pa-md q-mb-md bg-white">
      <q-img class="cursor-pointer" width="10%" height="10%" :src="movie.posterUrl || 'https://c0.lestechnophiles.com/www.numerama.com/wp-content/uploads/2013/07/AtTheMovies.jpg'" @click="updatePoster" />
      <q-input class="q-ml-md col self-start" dense outlined :rules="[val => val.length > 0 || 'Le titre est obligatoire']" v-model="movie.title" />
    </div>
    <div class="column rounded-borders q-pa-md q-mb-md bg-white">
      <div class="text-h6 q-mb-sm">Données</div>
      <div class="row items-center col q-mb-sm">
        <div class="row items-center">
          <div class="q-field--with-bottom">Année de sortie: </div>
          <q-input class="q-ml-md" dense outlined :rules="[val => val.length > 0 || 'L\'année est obligatoire']" v-model="movie.year" />
        </div>
        <div class="row items-center q-ml-md">
          <div class="q-field--with-bottom">Durée: </div>
          <q-input class="q-field--with-bottom q-ml-md" dense outlined v-model="movie.runtime" />
        </div>
        <div class="row items-center q-ml-md">
          <div class="q-field--with-bottom">Réalisateur: </div>
          <q-input class="q-ml-md" dense outlined :rules="[val => val.length > 0 || 'Le réalisateur est obligatoire']" v-model="movie.director" />
        </div>
      </div>
      <div class="row items-center col q-mb-sm">
        <div class="q-field--with-bottom">Acteurs: </div>
        <q-input class="q-field--with-bottom col q-ml-md" dense outlined v-model="movie.actors" />
      </div>
      <div class="column">
        <div>Genres: </div>
        <q-option-group class="row" v-model="movie.genres" :options="genres" type="checkbox" />
      </div>
    </div>
    <div class="column rounded-borders q-pa-md q-mb-md bg-white">
      <div class="text-h6 q-mb-sm">Intrigue</div>
      <q-input class="q-ml-md" type="textarea" dense outlined v-model="movie.plot" />
    </div>
    <div class="row rounded-borders q-pa-md items-center bg-white">
      <q-btn round flat icon="delete" color="negative" @click="remove" v-if="movie.id" />
      <q-space />
      <q-btn no-caps outline class="q-mr-md" label="Fermer" @click="close" />
      <q-btn no-caps color="primary" label="Enregistrer" type="submit" />
    </div>
  </q-form>
</template>

<script>
import { watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import { useMoviesStore } from 'src/stores/movies'

export default {
  name: 'pages-Details',

  setup () {
    const $moviesStore = useMoviesStore()
    const $route = useRoute()
    const $router = useRouter()
    const $q = useQuasar()

    const movie = computed(() => $moviesStore.edited)
    const genres = computed(() => $moviesStore.genres)

    const save = async () => {
      if (movie.value.id) {
        $moviesStore.update()
      } else {
        const id = await $moviesStore.create()
        $router.push({ name: 'movies-edit', params: { id } })
      }
    }

    const remove = () => {
      $q.dialog({
        title: 'Suppression d\'un film',
        message: `Etes-vous sûr de vouloir supprimer le film "${movie.value.title}"`,
        ok: 'Oui',
        cancel: 'Non'
      }).onOk(async () => {
        await $moviesStore.remove({ id: movie.value.id })
        $router.push({ name: 'movies' })
      })
    }

    const close = () => {
      $moviesStore.close()
      $router.push({ name: 'movies' })
    }

    const updatePoster = () => {
      $q.dialog({
        title: `Modification de l'affiche du film "${movie.value.title}"`,
        prompt: {
          model: movie.value.posterUrl || '',
          type: 'text'
        },
        ok: 'Changer',
        cancel: 'Annuler'
      }).onOk((val) => {
        movie.value.posterUrl = val
      })
    }

    watch($route, (val) => {
      if (val.name === 'movies-create') $moviesStore.close()
      if (val.name === 'movies-edit' && val.params.id) $moviesStore.edited = { ...$moviesStore.collection.find(m => m.id === +val.params.id) }
    }, { immediate: true })

    return {
      genres,
      movie,
      close,
      save,
      remove,
      updatePoster
    }
  }
}
</script>
