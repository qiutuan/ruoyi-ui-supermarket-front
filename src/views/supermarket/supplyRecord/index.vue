<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="供货时间">
        <el-date-picker v-model="daterangeSupplyTime" style="width: 240px" value-format="yyyy-MM-dd " type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['supermarket:supplyRecord:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['supermarket:supplyRecord:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['supermarket:supplyRecord:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['supermarket:supplyRecord:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="supplyRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="记录ID" align="center" prop="recordId" /> -->
      <el-table-column label="序号" type="index" @index="index => index + 1" />
      <el-table-column label="商品" align="center" prop="productName" />
      <el-table-column label="供货数量" align="center" prop="supplyQuantity" />
      <el-table-column label="供应商" align="center" prop="supplierName" />
      <el-table-column label="供货时间" align="center" prop="supplyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.supplyTime, '{y}-{m}-{d} ') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updatedAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['supermarket:supplyRecord:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['supermarket:supplyRecord:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改供货记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">


        <!-- <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择商品分类">
            <el-option v-for="item in productList" :label="item.categoryName" :value="item.categoryId"
              :key="item.categoryId"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="商品名称" prop="productId">
          <el-select v-if="form.productId == null" v-model="form.productId" placeholder="请选择商品名称">
            <el-option v-for="item in productList" :label="item.productName" :value="item.productId"
              :key="item.productId"></el-option>
          </el-select>

          <el-select v-else disabled v-model="form.productId" placeholder="请选择商品名称">
            <el-option v-for="item in productList" :label="item.productName" :value="item.productId"
                       :key="item.productId"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="供应商" prop="supplierId">
          <el-select v-if="form.supplierId == null" v-model="form.supplierId" placeholder="请选择供应商">
            <el-option v-for="item in supplierList" :label="item.supplierName" :value="item.supplierId"
              :key="item.supplierId"></el-option>
          </el-select>

          <el-select v-else disabled v-model="form.supplierId" placeholder="请选择供应商">
            <el-option v-for="item in supplierList" :label="item.supplierName" :value="item.supplierId"
                       :key="item.supplierId"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="供货数量" prop="supplyQuantity">
          <el-input v-model="form.supplyQuantity" placeholder="请输入供货数量" />
        </el-form-item>
        <el-form-item label="供货时间" prop="supplyTime">
          <el-date-picker clearable v-model="form.supplyTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择供货时间">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="创建时间" prop="createdAt">
          <el-date-picker clearable
            v-model="form.createdAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="修改时间" prop="updatedAt">
          <el-date-picker clearable
            v-model="form.updatedAt"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择修改时间">
          </el-date-picker>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSupplyRecord, getSupplyRecord, delSupplyRecord, addSupplyRecord, updateSupplyRecord } from "@/api/supermarket/supplyRecord";
import { listProduct } from "@/api/supermarket/product";
import { listSupplier } from "@/api/supermarket/supplier";

export default {
  name: "SupplyRecord",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 供货记录表格数据
      supplyRecordList: [],
      // 商品数据
      productList: [],
      // 供货商数据
      supplierList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 修改时间时间范围
      daterangeSupplyTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        supplierId: null,
        productId: null,
        supplyQuantity: null,
        supplyTime: null,
      },
      // 下拉框查询参数
      selectParams: {
        pageNum: 1,
        pageSize: 99999,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        supplierId: [
          { required: true, message: "供应商不能为空", trigger: "change" }
        ],
        productId: [
          { required: true, message: "商品不能为空", trigger: "change" }
        ],
        supplyQuantity: [
          { required: true, message: "供货数量不能为空", trigger: "blur" }
        ],
        // supplyTime: [
        //   { required: true, message: "供货时间不能为空", trigger: "blur" }
        // ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询供货记录列表 */
    getList() {
      this.loading = true;
      // this.getProductList();
      // this.getSupplierList();
      this.queryParams.params = {};
      if (null != this.daterangeSupplyTime && '' != this.daterangeSupplyTime) {
        this.queryParams.params["beginSupplyTime"] = this.daterangeSupplyTime[0];
        this.queryParams.params["endSupplyTime"] = this.daterangeSupplyTime[1];
      }
      listSupplyRecord(this.queryParams).then(response => {
        this.supplyRecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询商品列表 */
    getProductList() {
      this.loading = true;
      listProduct(this.selectParams).then(response => {
        this.productList = response.rows;
        this.loading = false;
      });
    },
    /** 查询供应商列表 */
    getSupplierList() {
      this.loading = true;
      listSupplier(this.selectParams).then(response => {
        this.supplierList = response.rows;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        recordId: null,
        supplierId: null,
        productId: null,
        supplyQuantity: null,
        supplyTime: null,
        createdAt: null,
        updatedAt: null,
        isDeleted: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeSupplyTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.recordId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加供货记录";
      this.getProductList();
      this.getSupplierList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const recordId = row.recordId || this.ids
      getSupplyRecord(recordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改供货记录";
        this.getProductList();
        this.getSupplierList();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.recordId != null) {
            updateSupplyRecord(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSupplyRecord(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordIds = row.recordId || this.ids;
      this.$modal.confirm('是否确认删除供货记录编号为"' + recordIds + '"的数据项？').then(function () {
        return delSupplyRecord(recordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('supermarket/supplyRecord/export', {
        ...this.queryParams
      }, `supplyRecord_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
