<template>
  <div id="show-blogs">
    <h1>All Blog Articles</h1>
    <input type="text" v-model="search" placeholder="search blogs" />
    <button type="submit"
            class="btn btn--green btn--go"
            @click.prevent="search"></button>
    <div class="wrapper">
      <p v-if="loading" class="text-centered">
        Loading...
      </p>
      <ul v-else class="image-card-grid">
        <image-card
          v-for="blog in blogs"
          :key="blog.id"
          :image="blog.image" />
      </ul>
    </div>
<!--    <div v-for="blog in filteredBlogs" class="single-blog">-->
<!--      <router-link v-bind:to="'/blog/' + blog.id"><h2>{{ blog.title }}</h2></router-link>-->
<!--      <article>{{ blog.body | snippet}}</article>-->
<!--    </div>-->
  </div>
</template>

<script>
// Imports
import searchMixin from '../mixins/searchMixin';
import axios from 'axios';
import ImageCard from './ImageCard';

export default {
  data() {
    return {
      blogs: [],
      loading: false,
      search: '',
    };
  },
  created() {
    const path = 'http://localhost:5000/blog';
    axios.get(path)
      .then((res) => {
        this.blogs = res.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  components: {
    ImageCard,
  },
  mixins: [searchMixin],
};
</script>

<style lang="scss">
#show-blogs{
  max-width: 800px;
  margin: 0px auto;
}
.single-blog{
  padding: 20px;
  margin: 20px 0;
  box-sizing: border-box;
  background: #eee;
}
#show-blogs a{
  color: #444;
  text-decoration: none;
}

.screen-reader-only {
  height: 1px;
  width: 1px;
  position: absolute;
  left: -100000px;
}
.text-centered {
  text-align: center;
}
.wrapper {
  margin: 0 auto;
  max-width: 800px;
  @media only screen and (max-width: 799px) {
    max-width: 100%;
    margin: 0 1.5rem;
  }
}
.image-card-grid {
  list-style: none;
  margin: .5rem 0;
  padding: 0;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #F0F0F0;
}
.searchbar {
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 549px) {
  width: 100%;
  label {
    width: 80%;
  }
}
}
.searchbar-input {
  padding: .5rem 1rem;
  border-radius: 20px;
  font-size: 1rem;
  border: 1px solid gray;
  min-width: 300px;
@media only screen and (max-width: 549px) {
  min-width: 0;
  width: 100%;
}
}
.btn {
  padding: .5rem 1rem;
  font-size: 1rem;
  border-radius: 20px;
  background: transparent;
  border: none;
}
.btn--green {
  background: #42b983;
  color: white;
  font-weight: bold;
}
.btn--go {
  padding: .5rem 2rem;
  margin-left: 1rem;
}
</style>
