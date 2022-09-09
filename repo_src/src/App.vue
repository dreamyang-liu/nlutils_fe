<template>
  <div id="app">
    <h1 class="logo">
      <span class="logo n">n</span><span class="logo l1">l</span
      ><span class="logo u">u</span><span class="logo t">t</span
      ><span class="logo i">i</span><span class="logo l2">l</span
      ><span class="logo s">s</span>
    </h1>
    <input type="file" id="file" style="color:white" accept=".json">

    <History :parameterWarehouse="paramerterWarehouse" />
  </div>
</template>

<script>
import History from "./views/History.vue";
import { ExperimentLogParser } from './utils/logUtils';

export default {
  name: "App",
  components: {
    History,
  },
  data() {
    return {
      paramerterWarehouse: {},
      fileList: [],
    };
  },
  mounted() {
    let _this = this;
    let file = document.getElementById("file");
      if(file == null) return;
      file.addEventListener("change", (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          const result = JSON.parse(reader.result);
          let logParser = new ExperimentLogParser();
          _this.paramerterWarehouse = logParser.parse(result);
        };
      });

  },
  methods: {
  },
};
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #2c3e50;
}

.logo {
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  margin: 0 auto;
  .n {
    color: rgb(245, 105, 105);
  }
  .l1 {
    color: rgb(255, 226, 60);
  }
  .u {
    color: rgb(131, 228, 107);
  }
  .t {
    color: rgb(79, 243, 255);
  }
  .i {
    color: rgb(74, 141, 204);
  }
  .l2 {
    color: rgb(147, 85, 218);
  }
  .s {
    color: rgb(228, 107, 212);
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
body {
  margin: 0 auto;
}
</style>
