<template>
  <div>
    <el-button text @click="dialogVisible = true" :type="'danger'"
      >Select Visible Paramter</el-button
    >

    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="50%"
      :before-close="handleClose"
    >
      <el-table
        :data="parameterSelectionList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" label="CheckStatus"></el-table-column>
        <el-table-column
          property="name"
          label="Parameter Name"
        ></el-table-column>
        <el-table-column
          property="fullName"
          label="Parameter Full Name"
        ></el-table-column>
      </el-table>
    </el-dialog>

    <el-table
      :data="tableData"
      border
      highlight-current-row
      :lazy="true"
      size="large"
      :flexible="true"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
    >
      <el-table-column
        sortable
        v-for="item in columns"
        :key="item.name"
        :label="item.name"
        :prop="item.prop"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "History",
  components: {},
  props: {
    parameterWarehouse: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dialogVisible: false,
      parameterSelectionList: [],
      tableData: [],
      columns: [],
    };
  },
  watch: {
    parameterWarehouse: {
      handler: function (val, oldVal) {
        this.columns = [];
        this.parameterSelectionList = [];
        if (val.brief_keys === undefined) return;
        for (let i = 0; i < val.brief_keys.length; i++) {
          this.columns.push({ name: val.brief_keys[i], prop: val.keys[i] });
          this.parameterSelectionList.push({
            name: val.brief_keys[i],
            fullName: val.keys[i],
          });
        }
        this.columns.sort((a, b) => a.name.localeCompare(b.name));
        this.parameterSelectionList.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        this.tableData = val.flatten_maps;
        this.$refs.multipleTable.doLayout();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.columns = [];
      for (let i = 0; i < val.length; i++) {
        this.columns.push({ name: val[i].name, prop: val[i].fullName });
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
  },
  computed: {},
};
</script>

<style></style>
