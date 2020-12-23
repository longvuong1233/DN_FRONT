<template>
  <v-card class="overflow-hidden">
    <v-app-bar
      absolute
      color="#43a047"
      dark
      shrink-on-scroll
      prominent
      src="https://picsum.photos/1920/1080?random"
      fade-img-on-scroll
      scroll-target="#scrolling-techniques-5"
      scroll-threshold="500"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <v-toolbar-title>Shipper</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-5"
      class="overflow-y-auto "
      max-height="800"
    >
      <v-container style="height: 1300px;">
        <v-data-table
          style="margin-top:150px"
          v-model="selected"
          :headers="headers"
          :items="orderBySearch"
          :single-select="singleSelect"
          item-key="id"
          :loading="getLoading"
          loading-text="Loading... Please wait"
          show-select
          class="elevation-1"
        >
          <template v-slot:top>
            <div class="row">
              <div class="col-md-4">
                <v-switch
                  @click="selected = []"
                  v-model="singleSelect"
                  label="Single select"
                  class="pa-3"
                ></v-switch>
              </div>
              <div class="col-md-3 offset-3">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </div>
            </div> </template
          ><template
            v-slot:item.data-table-select="{ item, isSelected, select }"
          >
            <v-simple-checkbox
              :value="isSelected"
              :disabled="checkOrder(item)"
              @input="select($event)"
            ></v-simple-checkbox>
          </template>
        </v-data-table>
        <div class="d-flex justify-end pt-2">
          <v-btn class="mx-2" fab dark large color="purple" @click="btnShip">
            <v-icon dark>
              mdi-motorbike
            </v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-sheet>
  </v-card>
</template>

<script>
import api from "../../apis/index";
import { mapGetters } from "vuex";
import Ripple from "vuetify/lib/directives/ripple";
export default {
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters("DONHANG", [
      "getLoading",
      "getHome",
      "getdepartureTime",
      "getOrderSort",
    ]),
  },
  async beforeCreate() {
    const result = await api.getDonhang();
    result.data.forEach((element) => {
      let trangthai = "";
      if (element.trangthai == 0) {
        trangthai = "Ready";
      } else if (element.trangthai == 1) {
        trangthai = "Delivering";
      } else {
        trangthai = "Deliveried";
      }
      this.desserts.push({ ...element, trangthai });
    });

    this.orderBySearch = [...this.desserts];
  },
  methods: {
    checkOrder(item) {
      if (item.trangthai == "Deliveried" || item.trangthai == "Delivering") {
        return true;
      }
      return false;
    },
    async btnShip() {
      if (this.selected.length != 0) {
        await api.markDeliveringOrders(this.selected);
        const now = new Date();
        const secondsSinceEpoch = Math.round(now.getTime() / 1000);
        this.$store.commit("DONHANG/setdepartureTime", secondsSinceEpoch);
        this.$store.commit("DONHANG/setTasks", this.selected);
        this.$store.dispatch("DONHANG/TSMOrder", {
          departure: this.getdepartureTime,
          home: this.getHome,
          tasks: this.selected,
        });
      } else {
        alert("Let Choose");
      }
    },
  },

  watch: {
    search(value) {
      this.orderBySearch = [];
      this.orderBySearch = this.desserts.filter((ele) => {
        if (ele.diachi.match(value)) {
          return true;
        }
        return false;
      });
    },
    getLoading(newValue) {
      if (newValue == false) {
        this.$router.push({
          name: "ship",
        });
      }
    },
  },
  data() {
    return {
      singleSelect: false,
      search: "",
      orderBySearch: [],
      selected: [],
      headers: [
        {
          text: "ID",
          align: "start",
          sortable: false,
          value: "id",
        },
        { text: "Name", value: "tendonhang" },
        { text: "Receiver", value: "tennguoinhan" },
        { text: "Address", value: "diachi" },
        { text: "Status", value: "trangthai" },
      ],
      desserts: [],
    };
  },
};
</script>
