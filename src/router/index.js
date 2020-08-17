import Vue from 'vue';
import Router from 'vue-router';
import Cars from '@/components/Cars';
import CarDetails from '@/components/CarDetails';
import Blog from '@/components/Blog';
import singleBlog from '@/components/singleBlog';
import AddBlog from '@/components/AddBlog';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Cars',
      component: Cars,
    },
    {
      path: '/cars/:id',
      name: 'Car details',
      component: CarDetails,
    },
    {
      path: '/blog',
      name: 'Blog ',
      component: Blog,
    },
    {
      path: '/blog/add',
      name: 'Add blog',
      component: AddBlog,
    },
    {
      path: '/blog/:id',
      name: 'Blog Details',
      component: singleBlog,
    },
  ],
  mode: 'history',
});
