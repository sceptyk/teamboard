import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from 'vuefire';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/IndexView.vue'),
      children: [
        {
          path: '',
          name: 'Index',
          redirect: { name: 'Teams' },
        },
        {
          path: 'teams',
          children: [
            {
              path: '',
              name: 'Teams',
              component: () => import('@/views/teams/TeamsView.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: ':teamId',
              children: [
                {
                  path: '',
                  name: 'TeamBoard',
                  component: () => import('@/views/team-board/TeamBoardView.vue'),
                  meta: {
                    requiresAuth: true,
                  },
                },
                {
                  path: 'invitation',
                  redirect: '',
                },
                {
                  path: 'invitation/:invitationId',
                  name: 'Invitation',
                  component: () => import('@/views/InvitationView.vue'),
                  meta: {
                    requiresAuth: true,
                  },
                },
                {
                  path: 'planning',
                  redirect: '',
                },
                {
                  path: 'planning/:boardId',
                  name: 'PlanningBoard',
                  component: () => import('@/views/planning-board/PlanningBoardView.vue'),
                  meta: {
                    requiresAuth: true,
                  },
                },
                {
                  path: 'retro',
                  redirect: '',
                },
                {
                  path: 'retro/:boardId',
                  name: 'RetroBoard',
                  component: () => import('@/views/retro-board/RetroBoardView.vue'),
                  meta: {
                    requiresAuth: true,
                  },
                },
              ],
              meta: {
                requiresAuth: true,
              },
            },
          ],
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/SettingsView.vue'),
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/LoginView.vue'),
    },
  ],
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        path: '/login',
        query: {
          redirectTo: to.fullPath,
        },
      };
    }
  }
});

export default router;
