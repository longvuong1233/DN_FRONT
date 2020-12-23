<template>
  <div>
    <v-card class="overflow-hidden mx-auto" height="500">
      <v-bottom-navigation
        absolute
        hide-on-scroll
        horizontal
        scroll-target="#hide-on-scroll-example"
      >
        <v-btn color="deep-purple accent-4" text>
          <span>Fee: {{ getTotalFee.toFixed(0) }}.000đ</span>

          <v-icon>mdi-cash-usd</v-icon>
        </v-btn>
        <v-btn color="deep-purple accent-4" text>
          <span>{{ startTime }}s</span>

          <v-icon>mdi-clock-start</v-icon>
        </v-btn>

        <v-btn
          color="deep-purple accent-4"
          text
          @click="btnGO"
          v-if="targetTask == -1"
        >
          <span>Start</span>

          <v-icon>mdi-rocket</v-icon>
        </v-btn>

        <v-btn color="deep-purple accent-4" text @click="btnNEXT">
          <span>{{ state }}</span>

          <v-icon>{{ iconState }}</v-icon>
        </v-btn>
        <v-btn color="deep-purple accent-4" text>
          <span
            >Estimated: {{ totalDistance }}
            {{ totalDistance > 1 ? "kms" : "km" }}</span
          >

          <v-icon>mdi-ruler</v-icon>
        </v-btn>
      </v-bottom-navigation>

      <v-responsive
        id="hide-on-scroll-example"
        class="overflow-y-auto"
        max-height="1500"
      >
        <div>
          <GmapMap :zoom="7" :center="{ lat: 41.85, lng: -87.65 }">
            <DirectionsRenderer
              travelMode="DRIVING"
              :origin="origin"
              :destination="destionation"
            />
          </GmapMap>
        </div>

        <br />
        <gmap-map
          :center="getHome"
          :zoom="12"
          style="width:100%;  height: 400px;"
          ><DirectionsRenderer
            :travelMode="travelMode"
            :origin="origin"
            :destination="destionation"
          />
          <gmap-marker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            @click="center = m.position"
          ></gmap-marker>
        </gmap-map>
      </v-responsive> </v-card
    ><v-stepper alt-labels v-model="e1">
      <v-stepper-header>
        <v-stepper-step step="0" :complete="e1 > 0">
          Đại Học Tôn Đức Thắng
        </v-stepper-step>

        <v-stepper-step
          :complete="e1 > index + 1"
          :step="index + 1"
          v-for="(value, index) in taskSort"
          :key="index"
        >
          {{ value.diachi }}
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
  </div>
</template>

<script>
import DirectionsRenderer from "./DirectionsRenderer";
import api from "../../apis/index";
import { mapGetters } from "vuex";
export default {
  created() {
    if (this.getTasks.length == 0) {
      this.$router.push({
        name: "home",
      });
    }
    for (let i = 0; i < this.getOrderSort.length; i++) {
      for (let j = 0; j < this.getTasks.length; j++) {
        if (this.getTasks[j].id == this.getOrderSort[i]) {
          this.taskSort.push(this.getTasks[j]);
          break;
        }
      }
    }
    this.totalDistance += this.getDistance(
      this.getHome,
      this.getInforTasksSorted[0]
    );
    for (let i = 1; i < this.getInforTasksSorted.length; i++) {
      this.totalDistance += this.getDistance(
        this.getInforTasksSorted[i],
        this.getInforTasksSorted[i - 1]
      );
    }
    this.totalDistance /= 1000;
    this.totalDistance = this.totalDistance.toFixed(2);
  },
  data() {
    return {
      //mặc định là Montreal
      totalDistance: 0,
      markers: [],
      places: [],
      state: "Next",
      startTime: 0,
      targetTask: -1,
      start: "",
      end: "",
      e1: 0,
      interval: null,
      taskSort: [],
      travelMode: "DRIVING",
      currentPlace: null,
    };
  },
  computed: {
    getTotalFee() {
      if (this.totalDistance < 4) {
        return 18;
      }
      return this.totalDistance * 8;
    },
    ...mapGetters("DONHANG", [
      "getHome",
      "getdepartureTime",
      "getTasks",
      "getOrderSort",
      "getInforTasksSorted",
    ]),
    iconState() {
      if (this.state == "Next") {
        return "mdi-debug-step-over";
      }
      return "mdi-marker-check";
    },
    origin() {
      if (!this.start) return null;
      return { query: this.start };
    },
    destionation() {
      if (!this.end) return null;
      return { query: this.end };
    },
  },
  components: {
    DirectionsRenderer,
  },
  mounted() {
    this.geolocate();
  },
  watch: {
    targetTask(newValue) {
      if (newValue != 0 && newValue <= this.taskSort.length - 1) {
        api.markDeliveriedOrders(this.taskSort[newValue - 1]);
      }
      if (newValue == this.taskSort.length - 1) {
        api.markDeliveriedOrders(this.taskSort[newValue]);
      }
      if (newValue < this.taskSort.length && newValue > 0) {
        this.e1++;
        this.start = this.taskSort[newValue - 1].diachi;
        this.end = this.taskSort[newValue].diachi;
      }

      if (newValue == this.taskSort.length - 1) {
        this.state = "End";
      }
    },
  },
  methods: {
    rad(x) {
      return (x * Math.PI) / 180;
    },
    getDistance(p1, p2) {
      var R = 6378137; // Earth’s mean radius in meter

      var dLat = this.rad(p2.lat - p1.lat);
      var dLong = this.rad(p2.lng - p1.lng);

      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.rad(p1.lat)) *
          Math.cos(this.rad(p2.lat)) *
          Math.sin(dLong / 2) *
          Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
    },
    btnGO() {
      this.startTime = 0;
      if (this.interval != null) {
        clearInterval(this.interval);
      }
      this.targetTask = 0;
      this.e1 = 1;
      this.state = "Next";
      this.start =
        "19 Đ.Nguyễn Hữu Thọ, Tân Hưng, Quận 7, Thành phố Hồ Chí Minh ";
      this.end = this.taskSort[0].diachi;
      this.interval = setInterval(() => {
        this.startTime += 1;
      }, 1000);
    },
    btnNEXT() {
      if (
        this.targetTask != -1 &&
        this.targetTask != this.taskSort.length - 1
      ) {
        this.targetTask++;
      }
    },
    // nhận địa điểm thông qua autocomplete component
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    direction() {
      let directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: this.origin,
          destination: this.destination,
          travelMode: this.travelMode,
        },
        (response, status) => {
          if (status !== "OK") return;
        }
      );
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },
  },
};
</script>
