<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item label="商品名称" prop="productName">-->
<!--        <el-input v-model="queryParams.productName" placeholder="请输入商品名称" clearable @keyup.enter.native="handleQuery" />-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['supermarket:product:add']">选择商品</el-button>

        <el-button type="warning" plain  size="mini" @click="cartList=[];getList()"
                   v-hasPermi="['supermarket:product:add']">清空</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"-->
<!--                   v-hasPermi="['supermarket:product:edit']">修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"-->
<!--                   v-hasPermi="['supermarket:product:remove']">删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"-->
<!--                   v-hasPermi="['supermarket:product:export']">导出</el-button>-->
<!--      </el-col>-->
<!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="cartList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="商品ID" align="center" prop="productId" /> -->
      <el-table-column label="商品图片" align="center" prop="imagePath" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.imagePath" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" prop="productName" />
      <el-table-column label="商品分类" align="center" prop="categoryName" />
      <el-table-column label="商品单价" align="center" prop="price" />
<!--      <el-table-column label="商品库存" align="center" prop="stock" />-->
      <el-table-column label="商品数量" align="center" prop="stock" >
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.productCount" :min="1" :max="scope.row.stock" size="small"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"-->
<!--                     v-hasPermi="['supermarket:product:edit']">修改</el-button>-->
          <el-button size="mini" type="text" icon="el-icon-delete" @click="delCartList(scope.row)"
                     v-hasPermi="['supermarket:product:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-divider></el-divider>
      <el-row>
        <el-col :span="8">
          商品总价：￥{{cartList.reduce((total, item) => total + item.price * item.productCount, 0).toFixed(2)}}
        </el-col>
        <el-col :span="14"  align="right">
          <el-button type="success" size="mini" @click="transactionRecordAdd"
                     v-hasPermi="['supermarket:product:add']">提 交</el-button>
        </el-col>
      </el-row>
    <el-divider></el-divider>

<!--    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"-->
<!--                @pagination="getList" />-->





    <!-- 添加或修改商品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>


      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="queryParams.productName" placeholder="请输入商品名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>


      <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
<!--        <el-table-column type="selection" width="55" align="center" />-->
        <!-- <el-table-column label="商品ID" align="center" prop="productId" /> -->
        <el-table-column label="商品图片" align="center" prop="imagePath" width="100">
          <template slot-scope="scope">
            <image-preview :src="scope.row.imagePath" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center" prop="productName" />
        <el-table-column label="商品分类" align="center" prop="categoryName" />
        <el-table-column label="商品价格" align="center" prop="price" />
        <el-table-column label="商品库存" align="center" prop="stock" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="small" :type="scope.row.stock <= 0 ? 'warning':'primary'" @click="addCartList(scope.row,scope.$index)"
                       :disabled="scope.row.stock <= 0" >添 加</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                  @pagination="getList" />


      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="accomplish">完 成</el-button>
<!--        <el-button @click="cancel">取 消</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProduct, getProduct, delProduct, addProduct, updateProduct } from "@/api/supermarket/product";
import { listCategory } from "@/api/supermarket/category";
import { listTransactionRecord, getTransactionRecord, delTransactionRecord, addTransactionRecord, updateTransactionRecord } from "@/api/supermarket/transactionRecord";

export default {
  name: "Product",
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
      // 商品表格数据
      productList: [],
      // 商品分类数据
      categoryList: [],
      //购物车数据
      cartList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productName: null,
        categoryId: null,
      },
      // 分类查询参数
      categoryParams: {
        pageNum: 1,
        pageSize: 99999,
        categoryName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        categoryId: [
          { required: true, message: "商品分类不能为空", trigger: "change" }
        ],
        productName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        // categoryId: [
        //   { required: true, message: "商品分类ID不能为空", trigger: "change" }
        // ],
        price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {

    //完成按钮
    accomplish() {
      this.open = false;
      // this.reset();
    },

    //添加购物车数据
    addCartList(row,index) {
      // console.log(row)
      row.productCount = 1;
      this.cartList.push({...row})
      this.productList.splice(index, 1)
      if(this.productList.length === 0) {
        this.queryParams.pageNum++;
        this.getList()
      }
      this.total--;
      // console.log(this.cartList)
    },

    //删除购物车数据
    delCartList(row) {
      this.cartList = this.cartList.filter(item => item.productId !== row.productId)
      this.total++;
    },

    //添加交易记录
    transactionRecordAdd() {
      if(this.cartList.length === 0) {
        this.$modal.msgError("请添加商品");
        return;
      }

      let transactionRecord = [];
      for (let i = 0; i < this.cartList.length; i++) {
        transactionRecord.push({
          productId: this.cartList[i].productId,
          quantity: this.cartList[i].productCount,
          transactionAmount: this.cartList[i].price * this.cartList[i].productCount,
        })
      }

      console.log(transactionRecord)

      addTransactionRecord(transactionRecord).then(response => {
        this.$modal.msgSuccess("提交成功");
        this.cartList = [];
        transactionRecord = [];
        this.getList();
      });
    },


    /** 查询商品列表 */
    getList() {
      this.loading = true;
      listProduct(this.queryParams).then(response => {
        this.productList = response.rows
        this.total = response.total - this.cartList.length;
        this.loading = false;

        //删除与购物车相同的数据
        if(this.cartList.length > 0) {
          for (let i = 0; i < this.cartList.length; i++) {
            for (let j = 0; j < this.productList.length; j++) {
              if (this.cartList[i].productId === this.productList[j].productId) {
                this.productList.splice(j, 1)
                this.total--;
              }
            }
          }
        }
      });
    },
    // 查询商品分类
    getCategoryList() {
      listCategory(this.categoryParams).then(response => {
        this.categoryList = response.rows
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
        productId: null,
        productName: null,
        categoryId: null,
        price: null,
        stock: null,
        imagePath: null,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.productId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.getList();
      this.getCategoryList();
      this.reset();
      this.open = true;
      this.title = "选择商品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.getCategoryList();
      this.reset();
      const productId = row.productId || this.ids
      getProduct(productId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.productId != null) {
            updateProduct(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then(response => {
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
      const productIds = row.productId || this.ids;
      const productName = row.productName || this.Name;
      this.$modal.confirm('是否确认删除商品为"' + productName + '"的数据项？').then(function() {
        return delProduct(productIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('supermarket/product/export', {
        ...this.queryParams
      }, `product_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
