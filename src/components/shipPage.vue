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
          <span>{{ startTime }}s</span>

          <v-icon>mdi-clock-start</v-icon>
        </v-btn>

        <v-btn color="deep-purple accent-4" text @click="btnGO">
          <span>Start</span>

          <v-icon>mdi-rocket</v-icon>
        </v-btn>

        <v-btn color="deep-purple accent-4" text @click="btnNEXT">
          <span>{{ state }}</span>

          <v-icon>{{ iconState }}</v-icon>
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
  },
  data() {
    return {
      //mặc định là Montreal

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
    ...mapGetters("DONHANG", [
      "getHome",
      "getdepartureTime",
      "getTasks",
      "getOrderSort",
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
