<template>
  <div>
    <el-table
      :data="parameterWarehouse"
      style="width: 100%"
      fit
      border
      height="750"
      @sort-change="changeTableSort"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :cell-class-name="tableCellClassName"
    >
      <template v-for="column in columns">
        <el-table-column
          v-if="column.prop === 'Name'"
          :key="column.prop"
          type="selection"
          align="center"
          width="180"
        >
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ExperimentLogParser } from "../utils/logUtils";
export default {
  name: "LogTable",
  props: {},
  data() {
    return {
      tableData: [],
    };
  },
  computed: {
    ...mapState({
      visibleParameterNames: (state) => state.visibleParameterNames,
    }),
    columns() {
      let columns = [];
      for (let i = 0; i < this.visibleParameterNames.length; i++) {
        columns.push({
          prop: this.visibleParameterNames[i],
          label: this.visibleParameterNames[i],
        });
      }
      return columns;
    },
  },
  mounted() {
    // this.mockInit();
  },

  methods: {
    tableCellClassName(cell) {
      let column = cell["column"];
      let row = cell["row"];
      let columnIndex = cell["columnIndex"];
      let rowIndex = cell["rowIndex"];
      if (Date.now() / 1000 - parseInt(row["end_time_stamp"]) < 24 * 3600) {
        if (columnIndex >= 2) return "newest-row-body";
        else return "newest-row-head";
      }
      return "";
    },
    changeTableSort(column) {
      console.log(column);
      var fieldName = column.prop;
      var sortingType = column.order;
      if (fieldName == "createTime") {
        this.tableData.map((item) => {
          item.createTime = this.$moment(item.createTime).valueOf();
        });
      }

      if (sortingType == "descending") {
        this.tableData = this.tableData.sort((a, b) =>
          typeof b[fieldName] !== "string"
            ? b[fieldName] - a[fieldName]
            : a[fieldName].localeCompare(b[fieldName])
        );
      } else {
        this.tableData = this.tableData.sort((a, b) =>
          typeof b[fieldName] !== "string"
            ? b[fieldName] - a[fieldName]
            : b[fieldName].localeCompare(a[fieldName])
        );
      }
    },

    mockInit() {
      let mockJSONText = String.raw`[{"parameters": {"epoch": 40, "batch_size": 128, "lr": 0.001, "device": "mps"}, "performance": {"accuracy": 0.8741, "f1": 0.8427789198383522}, "profile": {"name": "Test", "id": "574334d83280f6f3e47bcd5ba79c99b9", "commit_id": "fatal: not a git repository (or any of the parent directories): .git", "begin_timestamp": 1662589560.906, "end_timestamp": 1662590554.046, "elapsed_in_s": 993.14, "MD5": "fd7c06652157df21f8569f8e39587e97"}}]`;
      let logParser = new ExperimentLogParser();
      let json = JSON.parse(mockJSONText);
      let parameterWarehouse = logParser.parse(json);
      this.parameterWarehouse = parameterWarehouse;
      this.$store.commit("SET_PARAMETER_WAREHOUSE", parameterWarehouse);
    },

    init() {
      let request = new XMLHttpRequest();
      request.open("GET", "params/parameters.json");
      request.send(null);
      let _this = this;
      console.log("init");
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          let logParser = new ExperimentLogParser();
          let json = JSON.parse(request.responseText);
          let parameterWarehouse = logParser.parse(json);
          _this.$store.commit("SET_PARAMETER_WAREHOUSE", parameterWarehouse);
        }
      };
    },
  },
};
</script>

<style>
.el-table .newest-row-body {
  background: rgb(70, 43, 68, 0.2);
  color: rgb(8, 8, 8);
}

.el-table .newest-row-head {
  background: rgb(80, 103, 180);
  color: rgb(255, 255, 255);
}

.el-table__body .el-table__row.hover-row td {
  background: rgba(255, 181, 71, 0.7);
  font-size: 15px;
  font-weight: bold;
  color: rgb(78, 72, 72);
}
</style>
