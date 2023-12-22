<template>
  <div class="productProcess">

    <h1 class="title">库存告急 &nbsp;&nbsp;<i class="el-icon-loading"></i></h1>

    <!-- 如果页面刷新数据比较频繁，可以将loading、showFlag的相关代码删除，防止过于频繁的出现加载动画 -->
    <div class="loading_div" v-show="!showFlag">
      <div>Loading...</div>  <!-- 这个loading自己写，代码没贴出来 -->
    </div>

    <div class="success_info_body" v-show="showFlag">

      <!-- 标准title可以调用组件 -->
      <div class="title_div">
        <!--  <titleComponent :title="title"></titleComponent> -->  <!-- 标题组件自己写，代码没贴出来 -->
      </div>

      <!-- 参数名称、列数根据实际情况调整 -->
      <div class="table_body">
        <div class="table_th">
          <div class="tr1 th_style">商品名称</div>
          <div class="tr2 th_style">商品分类</div>
          <div class="tr3 th_style">剩余库存</div>
<!--          <div class="tr4 th_style">进度</div>-->
        </div>
        <div class="table_main_body">
          <div class="table_inner_body" :style="{top: tableTop + 'px'}">
            <div class="table_tr" v-for="(item,index) in tableList" :key="index">
              <div class="tr1 tr">{{item.productName}}</div>
              <div class="tr2 tr">{{item.categoryName}}</div>
              <div class="tr3 tr" v-if="item.stock!='-'">{{item.stock}}</div>
              <div class="tr3 tr" v-else>-</div>
<!--              <div class="tr4 tr" v-if="item.process!='-'">{{Number(item.process).toFixed(2)}} %</div>-->
<!--              <div class="tr4 tr" v-else>-</div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import titleComponent from "@/components/titleComponent";
import { listProduct, getProduct, delProduct, addProduct, updateProduct } from "@/api/supermarket/product";
export default {
  components: {
    // titleComponent
  },
  data() {
    return {
      showFlag: true,
      tableTimer: null,
      tableTop: 0,
      tableList: [],
      tableListSize: 0,
      componentTimer: null,

      //需要根据情况设置的参数
      title: "排产进度",
      visibleSize: 6, //容器内可视最大完整行数
      lineHeight: 49, //每行的实际高度（包含margin-top/bottom,border等）
      componentTimerInterval: 36000000, //刷新数据的时间间隔
      tableTimerInterval: 30 //向上滚动 1px 所需要的时间，越小越快，推荐值 100
    };
  },

  //如果没有父元素传值，将watch内的内容搬至mounted中即可
  props: ["activeFactoryId"],
  watch: {
    activeFactoryId(val, oldVal) {
      clearInterval(this.componentTimer);
      this.bsGetProductProcess();
      this.componentTimerFun();
    }
  },
  mounted() {
    clearInterval(this.componentTimer);
    this.bsGetProductProcess();
    this.componentTimerFun();
  },
  beforeDestroy() {
    clearInterval(this.componentTimer);
    clearInterval(this.tableTimer);
  },
  methods: {
    //调用数据接口，获取列表数据，根据自己情况填接口url
    bsGetProductProcess() {
      // this.tableList = this.tableList.concat(this.tableList);
      // this.tableActionFun();
      listProduct().then(response => {
        this.tableList = response.rows.filter(item => {
          return item.stock < 100;
        });
        this.showFlag = true;
        this.tableActionFun();
      });

      // clearInterval(this.tableTimer);
      // this.tableTop = 0;
      // if (this.activeFactoryId != "") {
      //   this.showFlag = false;
      //   this.$ajax({
      //     method: "get",
      //     url: `` //根据自己情况填接口url
      //   })
      //     .then(res => {
      //       this.tableList = res.data.data;
      //       this.showFlag = true;
      //       this.tableActionFun();
      //     })
      //     .catch(function(err) {
      //       console.log("bsGetProductProcess error!");
      //     });
      // }
    },
    tableActionFun() {
      this.tableListSize = this.tableList.length;
      if (this.tableListSize > this.visibleSize) {
        this.tableList = this.tableList.concat(this.tableList);
        this.tableTimerFun();
      } else {
        this.fillTableList();
      }
    },
    //当数据过少时，不触发自动轮播事件，并填充没有数据的行，参数根据实际情况修改即可
    fillTableList() {
      var addLength = this.visibleSize - this.tableListSize;
      for (var i = 0; i < addLength; i++) {
        this.tableList.push({
          productName: "-",
          categoryName: "-",
          stock: "-"
          // endDate: "-",
          // process: "-"
        });
      }
    },
    tableTimerFun() {
      var count = 0;
      this.tableTimer = setInterval(() => {
        if (count < (this.tableList.length / 2) * this.lineHeight) {
          this.tableTop -= 1;
          count++;
        } else {
          count = 0;
          this.tableTop = 0;
        }
      }, this.tableTimerInterval);
    },
    componentTimerFun() {
      this.componentTimer = setInterval(() => {
        this.bsGetProductProcess();
      }, this.componentTimerInterval);
    }
  }
};
</script>

<style scoped>
.productProcess {
  width: 550px;
  height: 418px;
  border: 1px solid rgba(0, 0, 0, 0.77);
  background-image: url("../../assets/images/bg.jpg");
  background-size: 90% 100%;
  margin-left: 100px;
  //margin-left: 10%;

  //background: rgba(248, 172, 175, 0.93);
}
.title {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
}
.loading_div {
  color: #eee;
  padding-top: 100px;
}
.title_div {
  width: 100%;
}
.table_body {
  width: 100%;
  //margin-top: 15px;
}
.table_th {
  width: 100%;
  display: flex;
  height: 40px;
  line-height: 40px;
}
.tr {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 5px;
  text-align: center;
  font-size: 14px;
}
.tr1 {
  width: 50%;
}
.tr2 {
  width: 15%;
}
.tr3 {
  width: 35%;
  font-size: 13px;
}

.th_style {
  color: rgb(255, 255, 255);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  font-size: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0 5px;
  text-align: center;
}
.table_main_body {
  width: 100%;
  height: 294px;
  overflow: hidden;
  position: relative;
}
.table_inner_body {
  width: 100%;
  position: absolute;
  left: 0;
}
.table_tr {
  display: flex;
  height: 40px;
  line-height: 40px;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  font-size: 15px;
  background: rgba(0, 9, 9, 0.1);
  border: 1px solid rgb(4, 114, 131);
  margin-top: 7px;
}
</style>
