<template>
  <div id="add-blog">
    <h2>Add a New Blog Post</h2>
    <alert :message=message v-if="showMessage"></alert>
    <form v-if="!submitted">
      <label>Blog Title:</label>
      <input type="text" v-model.lazy="blog.title" required />
      <label>Blog Content:</label>
      <textarea v-model.lazy.trim="blog.content"></textarea>
      <div id="checkboxes">
        <p>Blog Categories:</p>
        <label>Ninjas</label>
        <input type="checkbox" value="ninjas" v-model="blog.categories" />
        <label>Wizards</label>
        <input type="checkbox" value="wizards" v-model="blog.categories" />
        <label>Mario</label>
        <input type="checkbox" value="mario" v-model="blog.categories" />
        <label>Cheese</label>
        <input type="checkbox" value="cheese" v-model="blog.categories" />
      </div>
      <label> Author:
      <select v-model="blog.author">
        <option v-for="author in authors">{{ author }}</option>
      </select>
      </label>
      <hr />
      <picture-input
        ref="pictureInput"
        width="300"
        height="300"
        margin="16"
        accept="image/jpeg,image/png"
        size="10"
        button-class="btn"
        :custom-strings="{
        upload: '<h1>Bummer!</h1>',
        drag: 'Drag a 😺 GIF or GTFO'
      }"
        @change="onChange">
      </picture-input>
      <hr />
      <button v-on:click.prevent="postBlog" >Add Blog</button>
    </form>
    <div v-if="submitted">
      <h3>Thanks for adding your post</h3>
    </div>
    <div id="preview">
      <h3>Preview blog</h3>
      <p>Blog title: {{ blog.title }}</p>
      <p>Blog content:</p>
      <p style="white-space: pre">{{ blog.content }}</p>
      <p>Blog Categories:</p>
      <ul>
        <li v-for="category in blog.categories">{{ category }}</li>
      </ul>
      <p>Author: {{ blog.author }}</p>
    </div>
  </div>
</template>

<script>
// Imports
import axios from 'axios';
import Alert from './Alert';
import PictureInput from 'vue-picture-input';
import upload from '../helpers/upload';

export default {
  data() {
    return {
      blog: {
        title: '',
        content: '',
        categories: [],
        author: '',
      },
      authors: ['Developer', 'Manager', 'Owner'],
      submitted: false,
      showMessage: false,
      message: '',
    };
  },
  components: {
    alert: Alert,
    PictureInput,
  },
  methods: {
    // eslint-disable-next-line func-names
    postBlog() {
      const path = 'http://localhost:5000/blog/add';
      const payload = {
        title: this.blog.title,
        body: this.blog.content,
        author: this.blog.author,
      };
      axios.post(path, payload)
        .then(() => {
          console.log('nice');
          this.showMessage = true;
          this.message = 'Added blog!';
          // this.submitted = true;
          upload.upload_image();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onChange() {
      console.log('changed');
    },
  },
};
</script>

<style scoped>
#add-blog *{
  box-sizing: border-box;
}
#add-blog{
  margin: 20px auto;
  max-width: 500px;
}
label{
  display: block;
  margin: 20px 0 10px;
}
input[type="text"], textarea{
  display: block;
  width: 100%;
  padding: 8px;
}
#preview{
  padding: 10px 20px;
  border: 1px dotted #ccc;
  margin: 30px 0;
}
h3{
  margin-top: 10px;
}
#checkboxes input{
  display: inline-block;
  margin-right: 10px;
}
#checkboxes label{
  display: inline-block;
  margin-top: 0;
}
</style>
