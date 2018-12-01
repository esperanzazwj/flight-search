export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/list/table-list',
        icon: 'dashboard',
        name: 'Flight Search',
        component: './List/TableList',
      },
      { path: '/', redirect: '/list/table-list' },
      {
        path: '/list/basic-list',
        icon: 'check-circle-o',
        name: 'Wish List',
        component: './List/BasicList',
      },
    ],
  },
];
