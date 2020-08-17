<template>
  <div id="single-blog">
    <h1>{{ blog.title }}</h1>
    <article>{{ blog.body }}</article>
  </div>
</template>

<script>
// Imports
// import searchMixin from '../mixins/searchMixin';
import axios from 'axios';

export default {
  data() {
    return {
      id: this.$route.params.id,
      blog: {},
    };
  },
  created() {
    const path = `http://localhost:5000/blog/${this.id}`;
    axios.get(path)
      .then((res) => {
        this.blog = res.data;
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>

<style>
#single-blog{
  max-width: 960px;
  margin: 0 auto;
}
</style>
