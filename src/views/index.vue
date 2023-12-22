<template>
  <div class="app-container home">
    <div class = "chartCategory" ref="chart" id="chartRevenueStatistics"></div>


<!--    <template>-->
<!--      <el-carousel height="200px" direction="vertical">-->
<!--        <el-carousel-item v-for="item in 3" :key="item">-->
<!--          <h3 class="medium">{{ item }}</h3>-->
<!--        </el-carousel-item>-->
<!--      </el-carousel>-->
<!--    </template>-->
    <list-for/>
    <transaction-record-for/>



    <div class = "chartCategory" ref="chart" id="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getEchartsMsg } from "@/api/supermarket/echarts";
import ListFor from '@/components/listFor/listFor.vue'
import TransactionRecordFor from '@/components/listFor/TransactionRecordFor.vue'

export default {
  name: "Index",
  components: { TransactionRecordFor, ListFor },
  data() {
    return {
      categoryList: [],
      productCounts: [],
      revenueStatisticsList: [],
      revenueStatisticsCounts: [],
    };
  },
  watch: {
    categoryList: {
      immediate: true, // 立即执行一次
      handler(newVal, oldVal) {
        if (newVal.length > 0) {
          this.initChart(); // 当supplyRecordList数据发生变化时，执行图表初始化操作
        }
      }
    }
  },

  created() {
    this.getList();
  },
  // mounted() {
  //   // this.getList(); // 页面加载时发送一次请求
  //   setInterval(() => {
  //     this.getList(); // 每隔3秒发送一次请求
  //   }, 3000);
  // },
  methods: {
    //查询商品分类管理列表
    getList() {
      getEchartsMsg().then(response => {
        this.categoryList = response.data.categoryList;
        this.productCounts = response.data.categoryCountList;
        this.revenueStatisticsList = response.data.revenueStatisticsList;

      });
    },

    initChart() {

      const chart = echarts.init(document.getElementById("chart"));
      const chartRevenueStatistics = echarts.init(document.getElementById("chartRevenueStatistics"));

      chartRevenueStatistics.setOption({
        title: {
          text: '最近15天销售额',
          left: 'center',
        },
        color: [
          '#3398DB'
        ],
        xAxis: {
          type: 'category',
          data: this.revenueStatisticsList.map(item => item.date)
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        series: [
          {
            data: this.revenueStatisticsList.map(item => item.totalSales),
            type: 'line',
            smooth: true,
            name: '销售额',
          }
        ]
      })

      chart.setOption({
        color: [
          '#d48265'
        ],
        title: {
          text: '各类别产品数量',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          data: this.categoryList.map(item => item.categoryName)
        },
        yAxis: {
          type: 'value',
          axisLabel:{
            // formatter:  function (value, index) {
            //   return value.toFixed(0);
            // }
          }
        },
        series: [
          {
            name: '产品数量',
            type: 'bar',
            data: this.productCounts
          }
        ]
      });
    }
  }
};
</script>

<style scoped lang="scss">

.app-container.home {
  clear: both;
  padding: 20px;
  //background-image: url("../assets/images/page_bg.png");
  height: 100%;
  overflow: auto;
}
.chartRevenueStatistics {
  width: auto;
  height: 550px;
  //margin: 0 auto;
}

// 商品分类柱状图
.chartCategory {
  width: auto;
  height: 500px;
  //margin: 0 auto;
  margin-top: 50px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

</style>

