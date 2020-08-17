<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>Cars panel</h1>
        <hr><br><br>
        <alert :message=message v-if="showMessage"></alert>
        <button type="button" class="btn btn-success btn-sm" v-b-modal.car-modal>Add Car</button>
        <br><br>
        <b-col lg="6" class="my-1">
          <b-form-group
            label="Filter"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            label-for="filterInput"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Type to Search"
              ></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </div>
    </div>
    <div>
      <b-table
        stacked="md"
        small
        selectable
        :items="this.cars"
        :fields="fields"
        :busy.sync="isBusy"
        @row-clicked="(item, index, event) => onRowSelected(item)"
        class="mt-3"
        outlined
        :filter="filter"
        @filtered="onFiltered"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection">
        <template v-slot:table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template v-slot:cell(actions)="row">
          <b-button class="btn btn-warning btn-sm"
                    v-b-modal.car-update-modal
                    @click="editCar(row.item)">
            Update
          </b-button>
          <b-button class="btn btn-danger btn-sm" @click="deleteCar(row.item)">
            Delete
          </b-button>
        </template>
      </b-table>
    </div>
    <b-modal ref="addCarModal"
             id="car-modal"
             title="Add a new car"
             hide-footer>
      <b-form @submit="onSubmit" @reset="onReset" class="w-100">
        <b-form-group id="form-model-group"
                    label="Model:"
                    label-for="form-model-input">
          <b-form-input id="form-model-input"
                        type="text"
                        v-model="addCarForm.model"
                        required
                        placeholder="Bmw">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-age-group"
                      label="Year:"
                      label-for="form-age-input">
            <b-form-input id="form-age-input"
                          type="text"
                          v-model="addCarForm.age"
                          required
                          placeholder="2020">
            </b-form-input>
          </b-form-group>
        <b-form-group id="form-picture-group"
                      label="Pick image:"
                      label-for="form-picture-group">
          <b-form-file id="form-picture-group"
                       ref="file-input"
                       multiple
                       v-model="addCarForm.files"
                       :state="Boolean(addCarForm.files.length)"
                       :file-name-formatter="formatNames"
                       placeholder="choose image..."
                       drop-placeholder="drop image..."
                       accept=".jpg, .png, .gif"
          >
          </b-form-file>
        </b-form-group>
        <b-form-group id="form-sold-group">
          <b-form-checkbox-group v-model="addCarForm.sold" id="form-checks">
            <b-form-checkbox value="true">Sold?</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>
    <b-modal ref="editCarModal"
             id="car-update-modal"
             title="Update"
             hide-footer>
      <b-form @submit="onSubmitUpdate" @reset="onResetUpdate" class="w-100">
      <b-form-group id="form-model-edit-group"
                    label="Model:"
                    label-for="form-model-edit-input">
          <b-form-input id="form-model-edit-input"
                        type="text"
                        v-model="editCarForm.car_model"
                        required
                        placeholder="Bmw">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-age-edit-group"
                      label="Year:"
                      label-for="form-age-edit-input">
            <b-form-input id="form-age-edit-input"
                          type="text"
                          v-model="editCarForm.year"
                          required
                          placeholder="2020">
            </b-form-input>
          </b-form-group>
        <b-form-group id="form-sold-edit-group">
          <b-form-checkbox-group v-model="editCarForm.sold" id="form-checks">
            <b-form-checkbox value="true">Sold?</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-button type="submit" variant="primary">Update</b-button>
        <b-button type="reset" variant="danger">Cancel</b-button>
      </b-form>
    </b-modal>
  </div>
</template>
<script>

import axios from 'axios';
import Alert from './Alert';
import PictureInput from 'vue-picture-input';

export default {
  data() {
    return {
      cars: [],
      url: process.env.VUE_APP_URL,
      fields: [
        { key: 'car_model', label: 'Car Model', sortable: true, sortDirection: 'desc' },
        { key: 'year', label: 'Car year', sortable: true, class: 'text-center' },
        {
          key: 'is_sold',
          label: 'is Sold',
          formatter: value => (value ? 'Yes' : 'No'),
          sortable: true,
          sortByFormatted: true,
          filterByFormatted: true,
        },
        { key: 'actions', label: 'Actions' },
      ],
      isBusy: false,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      addCarForm: {
        model: '',
        age: '',
        sold: [],
        files: [],
      },
      editCarForm: {
        id: '',
        model: '',
        age: '',
        sold: [],
      },
      message: '',
      showMessage: false,
    };
  },
  components: {
    alert: Alert,
    PictureInput,
  },
  // todo rewrite methods in special class
  methods: {
    getCars() {
      const path = 'http://localhost:5000/cars';
      console.log('VUE_APP_URL=', this.url);
      this.isBusy = !this.isBusy;
      axios.get(path)
        .then((res) => {
          console.log(res.data);
          this.cars = res.data;
          this.isBusy = !this.isBusy;
        })
        .catch((error) => {
          // eslint-отключение следующей строки
          console.error(error);
          this.isBusy = !this.isBusy;
        });
    },
    addCar(payload) {
      const path = 'http://localhost:5000/car';
      this.isBusy = !this.isBusy;
      axios.post(path, payload)
        .then(() => {
          this.getCars();
          this.message = 'Car added!';
          this.showMessage = true;
          this.isBusy = !this.isBusy;
        })
        .catch((error) => {
          // eslint-отключение следующей строки
          console.log(error);
          this.getCars();
          this.isBusy = !this.isBusy;
        });
    },
    initForm() {
      this.addCarForm.model = '';
      this.addCarForm.age = '';
      this.addCarForm.sold = [];
      this.addCarForm.files = [];
      this.editCarForm.id = '';
      this.editCarForm.model = '';
      this.editCarForm.age = '';
      this.editCarForm.sold = [];
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.addCarModal.hide();
      let sold = false;
      console.log('files count:', this.addCarForm.files.length);
      if (this.addCarForm.sold[0]) sold = true;
      const payload = {
        model: this.addCarForm.model,
        age: this.addCarForm.age,
        sold, // сокращённое свойство
      };
      this.addCar(payload);
      this.initForm();
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.addCarModal.hide();
      this.initForm();
    },
    onResetUpdate(evt) {
      evt.preventDefault();
      this.$refs.editCarModal.hide();
      this.initForm();
      this.getCars();
    },
    editCar(item) {
      this.editCarForm = item;
    },
    onSubmitUpdate(evt) {
      evt.preventDefault();
      this.$refs.editCarModal.hide();
      let sold = false;
      // if (this.editCarForm.sold[0]) sold = true;
      const payload = {
        model: this.editCarForm.car_model,
        year: this.editCarForm.year,
        sold, // сокращённое свойство
      };
      this.updateCar(payload, this.editCarForm.id);
    },
    updateCar(payload, carID) {
      this.isBusy = !this.isBusy;
      const path = `http://localhost:5000/car/${carID}`;
      axios.put(path, payload)
        .then(() => {
          this.getCars();
          this.message = 'Car updated!';
          this.showMessage = true;
          this.isBusy = !this.isBusy;
        })
        .catch((error) => {
          console.error(error);
          this.getCars();
          this.isBusy = !this.isBusy;
        });
    },
    deleteCar(car) {
      this.removeCar(car.id);
    },
    removeCar(carID) {
      const path = `http://localhost:5000/car/${carID}`;
      this.isBusy = !this.isBusy;
      axios.delete(path)
        .then(() => {
          this.getCars();
          this.message = 'Car removed!';
          this.showMessage = true;
          this.isBusy = !this.isBusy;
        })
        .catch((error) => {
          console.error(error);
          this.getCars();
          this.isBusy = !this.isBusy;
        });
    },
    onRowSelected(car) {
      this.$router.push({ path: `cars/${car.id}` });
    },
    onFiltered(filteredItems) {
      console.log(filteredItems.length);
    },
    formatNames(files) {
      if (files.length === 1) {
        return files[0].name;
      } else {
        return `${files.length} files selected`;
      }
    },
  },
  created() {
    this.getCars();
  },
};
</script>
