
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      {
        path: '',
        name: 'movies',
        component: () => import('pages/Index.vue'),
        children: [
          {
            path: '/movies/:id',
            name: 'movies-edit',
            component: () => import('pages/Details.vue')
          },
          {
            path: '/movies/create',
            name: 'movies-create',
            component: () => import('pages/Details.vue')
          }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
