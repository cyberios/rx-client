<template>
  <div id="car-details">
    <h1> Car id: {{ this.car.id }} </h1>
    <div>
      <b-table striped
               hover
               caption-top
               small
               stacked="true"
               :fields="fields"
      >
      </b-table>
    </div>
  </div>

</template>

<script>

import axios from 'axios';

export default {
  data() {
    return {
      id: this.$route.params.id,
      car: {},
      fields: [
        { key: 'model', label: 'Car Model' },
        { key: 'year', label: 'Car year' },
      ],
    };
  },
  methods: {
    getCar() {
      const path = 'http://localhost:5000/cars/';
      axios.get(path + this.id)
        .then((res) => {
          this.car = res.data[0];
          console.log(this.car);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  created() {
    this.getCar();
  },
};
</script>

<style>
body {
  padding: 1rem;
}
</style>
