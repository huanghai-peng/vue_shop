<template>
  <div class="reports">
    <el-breadcrumb separator="/"
                   style="font-size: 12px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <h1>用户来源</h1>
      <div class="main">
        <div class="clumn bar1">
          <h2>柱状图-就业行业</h2>
          <div class="echart"></div>
          <div class="clumn-bar-line"></div>
        </div>
        <div class="clumn bar2">
          <h2>柱状图-就业行业</h2>
          <div class="echart"></div>
          <div class="clumn-bar-line"></div>
        </div>

        <div class="clumn line1">
          <h2>
            折线图-人员变化
            <a href="javascript:;">2020</a>
            <a href="javascript:;">2021</a>
          </h2>
          <div class="echart"></div>
          <div class="clumn-bar-line"></div>
        </div>

        <div class="clumn line2">
          <h2>
            折线图-播放量
          </h2>
          <div class="echart"></div>
          <div class="clumn-bar-line"></div>
        </div>

        <div class="clumn pie1">
          <h2>
            饼形图-年龄分布
          </h2>
          <div class="echart"></div>
          <div class="clumn-bar-line"></div>
        </div>

        <div class="clumn pie2">
          <h2>
            饼形图-地区分布
          </h2>
          <div class="echart"></div>
          <div class="clumn-bar-line"></div>
        </div>
      </div>

    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {}
  },
  methods: {
    echartInit() {
      // 柱状图
      ;(function () {
        let bar1 = document.querySelector('.bar1 .echart')
        let myChart = echarts.init(bar1)

        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          grid: {
            left: '0',
            right: '0',
            bottom: '0',
            containLabel: true,
            height: '90%',
          },
          xAxis: [
            {
              type: 'category',
              data: [
                '旅游行业',
                '教育行业',
                '游戏行业',
                '医疗行业',
                '电商行业',
                '社交行业',
                '金融行业',
              ],
              axisTick: {
                alignWithLabel: true,
              },
              axisLabel: {
                textStyle: {
                  color: '#8C8FA9',
                },
              },
              axisLine: {
                lineStyle: {
                  color: '#161C49',
                },
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                textStyle: {
                  color: '#8C8FA9',
                },
              },
              // y轴的一点颜色
              axisLine: {
                lineStyle: {
                  color: '#161C49',
                },
              },
              splitLine: {
                //分割线配置
                show: true,
                lineStyle: {
                  color: '#171E4C',
                },
              },
              splitNumber: 4,
            },
          ],
          series: [
            {
              name: '直接访问',
              type: 'bar',
              barWidth: '30%',
              data: [200, 300, 300, 300, 1500, 1200, 600],
              // 普通样式。
              itemStyle: {
                // 点的颜色。
                normal: {
                  //这里设置柱形图圆角
                  barBorderRadius: 5,
                  color: '#2F89CF',
                },
              },
            },
          ],
        }

        myChart.setOption(option)
      })()

      // 柱状图
      ;(function () {
        let bar2 = document.querySelector('.bar2 .echart')
        let myChart = echarts.init(bar2)
        let option = {
          grid: {
            left: '10',
            right: '30',
            bottom: '0',
            containLabel: true,
            height: '90%',
          },
          xAxis: {
            type: 'value',
            splitLine: { show: false }, //坐标轴在 grid 区域中的分隔线
            axisTick: { show: false }, //坐标轴刻度
            axisLine: { show: false }, //坐标轴轴线
            axisLabel: {
              show: false,
            },
          },
          yAxis: [
            {
              type: 'category',
              data: ['NODE', 'VUE', 'javascript', 'CSS3', 'HTML5'],
              // 刻度
              axisTick: { show: false },
              // 标签线
              axisLine: { show: false },
              // 标签
              axisLabel: {
                textStyle: {
                  color: '#F9F9FB',
                },
              },
            },
            {
              data: ['664', '793', '610', '305', '702'],
              // 刻度
              axisTick: { show: false },
              // 标签线
              axisLine: { show: false },
              // 标签
              axisLabel: {
                textStyle: {
                  color: '#F9F9FB',
                },
              },
            },
          ],
          series: [
            {
              data: [100, 100, 100, 100, 100],
              type: 'bar',
              barWidth: '45%',
              // 普通样式。
              itemStyle: {
                // 点的颜色。
                normal: {
                  //这里设置柱形图圆角
                  barBorderRadius: 15,
                  color: 'none',
                  borderStyle: 'solid',
                  borderWidth: 3,
                  borderColor: '#00C1DE',
                },
              },
            },
            {
              name: '进度条背景',
              type: 'bar',
              barGap: '-100%', //不同系列的柱间距离，为百分比。
              // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
              // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
              //并且是对此坐标系中所有 'bar' 系列生效。
              barWidth: '45%',
              data: [69, 70, 60, 34, 70],
              // 在中间显示文字
              label: {
                show: true,
                formatter: '{c}%',
              },
              itemStyle: {
                normal: {
                  barBorderRadius: 15,

                  color: function (params) {
                    let colorList = [
                      '#8B78F6',
                      '#F8B448',
                      '#56D0E3',
                      '#F57474',
                      '#2F89CF',
                    ]
                    return colorList[params.dataIndex % colorList.length]
                  },
                },
              },
            },
          ],
        }
        myChart.setOption(option)
      })() // 折线图
      ;(function () {
        let yearData = [
          {
            year: '2020', // 年份
            data: [
              // 两个数组是因为有两条线
              [24, 40, 101, 134, 90, 230, 210, 230, 120, 230, 210, 120],
              [40, 64, 191, 324, 290, 330, 310, 213, 180, 200, 180, 79],
            ],
          },
          {
            year: '2021', // 年份
            data: [
              // 两个数组是因为有两条线
              [123, 175, 112, 197, 121, 67, 98, 21, 43, 64, 76, 38],
              [143, 131, 165, 123, 178, 21, 82, 64, 43, 60, 19, 34],
            ],
          },
        ]
        let line1 = document.querySelector('.line1 .echart')
        let myChart = echarts.init(line1)

        let option = {
          color: ['#00f2f1', '#ed3f35'],
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['新增粉丝', '新增游客'],
            right: 50,
            textStyle: {
              color: '#4C9BFD',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
            height: '80%',
            borderColor: '#012f4a', // 边框颜色
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月',
            ],
            axisLabel: {
              textStyle: {
                color: '#458EEB',
              },
            },
            // y轴的一点颜色
            axisLine: {
              lineStyle: {
                color: '#012F4A',
              },
            },
            splitLine: {
              //分割线配置
              show: true,
              lineStyle: {
                color: '#171E4C',
              },
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#458EEB',
              },
            },
            // y轴的一点颜色
            axisLine: {
              lineStyle: {
                color: '#012F4A',
              },
            },
            splitLine: {
              //分割线配置
              show: true,
              lineStyle: {
                color: '#171E4C',
              },
            },
          },
          series: [
            {
              name: '新增粉丝',
              type: 'line',
              data: yearData[0].data[0],
              smooth: true,
            },
            {
              name: '新增游客',
              type: 'line',
              data: yearData[0].data[1],
              // 将折线修饰圆滑
              smooth: true,
            },
          ],
        }

        myChart.setOption(option)

        let as = document.querySelectorAll('.line1 a')
        for (let i = 0; i < as.length; i++) {
          as[i].onclick = function () {
            option.series[0].data = yearData[i].data[0]
            option.series[1].data = yearData[i].data[1]
            myChart.setOption(option)
          }
        }
      })() // 折线图--播放量
      ;(function () {
        let line2 = document.querySelector('.line2 .echart')
        let myChart = echarts.init(line2)

        let option = {
          color: ['#0184D5', '#00D887'],
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['播放量', '转发量'],
            textStyle: {
              color: '#8186A1',
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
            height: '80%',
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: [
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',
                '24',
                '25',
                '26',
                '27',
                '28',
                '29',
                '30',
              ],
              axisLabel: {
                textStyle: {
                  color: '#959CBA',
                },
              },
              // y轴的一点颜色
              axisLine: {
                lineStyle: {
                  color: '#485172',
                },
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                textStyle: {
                  color: '#929ABB',
                },
              },
              // y轴的一点颜色
              axisLine: {
                lineStyle: {
                  color: '#1B2871',
                },
              },
              splitLine: {
                //分割线配置
                show: true,
                lineStyle: {
                  color: '#162663',
                },
              },
            },
          ],
          series: [
            {
              name: '播放量',
              type: 'line',
              areaStyle: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(1, 132, 213, 0.4)', // 渐变色的起始颜色
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(1, 132, 213, 0.1)', // 渐变线的结束颜色
                    },
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
              },

              data: [
                30, 40, 30, 40, 30, 40, 30, 60, 20, 40, 30, 40, 30, 40, 30, 40,
                30, 60, 20, 40, 30, 40, 30, 40, 30, 40, 20, 60, 50, 40,
              ],
              smooth: true,
              // 开始不显示拐点，鼠标进入显示
              showSymbol: false,
              symbol: 'circle', //将小圆点改成实心 不写symbol默认空心
              symbolSize: 5, //小圆点的大小
            },
            {
              name: '转发量',
              type: 'line',
              areaStyle: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(0, 216, 135, 0.4)',
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(0, 216, 135, 0.1)',
                    },
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
              },
              data: [
                130, 10, 20, 40, 30, 40, 80, 60, 20, 40, 90, 40, 20, 140, 30,
                40, 130, 20, 20, 40, 80, 70, 30, 70, 30, 120, 20, 99, 50, 20,
              ],
              smooth: true,
              // 开始不显示拐点，鼠标进入显示
              showSymbol: false,
              symbol: 'circle', //将小圆点改成实心 不写symbol默认空心
              symbolSize: 5, //小圆点的大小
            },
          ],
        }

        myChart.setOption(option)
      })() // 饼形图--年龄分布
      ;(function () {
        let pie1 = document.querySelector('.pie1 .echart')
        let myChart = echarts.init(pie1)

        let option = {
          tooltip: {
            trigger: 'item',
          },
          // 控制下面组件
          legend: {
            bottom: '0',
            left: 'center',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              color: '#6D7292',
            },
          },
          series: [
            {
              name: '年龄分布',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center',
              },
              labelLine: {
                show: false,
              },
              data: [
                { value: 1, name: '20岁以下' },
                { value: 4, name: '20-29岁' },
                { value: 2, name: '30-39岁' },
                { value: 2, name: '40-49岁' },
                { value: 1, name: '50岁以上' },
              ],
              itemStyle: {
                normal: {
                  color: function (colors) {
                    var colorList = [
                      '#065AAB',
                      '#066EAB',
                      '#0682AB',
                      '#0696AB',
                      '#06A0AB',
                    ]
                    return colorList[colors.dataIndex % colorList.length]
                  },
                },
              },
            },
          ],
        }

        myChart.setOption(option)
      })()
      ;(function () {
        let pie2 = document.querySelector('.pie2 .echart')
        let myChart = echarts.init(pie2)
        let option = {
          legend: {
            top: 'bottom',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              color: '#6D7292',
              fontSize: 9,
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          series: [
            {
              name: '面积模式',
              type: 'pie',
              radius: [10, 70],
              center: ['50%', '45%'],
              roseType: 'area',
              data: [
                { value: 20, name: '云南' },
                { value: 26, name: '北京' },
                { value: 24, name: '山东' },
                { value: 25, name: '河北' },
                { value: 20, name: '江苏' },
                { value: 25, name: '浙江' },
                { value: 30, name: '四川' },
                { value: 42, name: '湖北' },
              ],
              itemStyle: {
                normal: {
                  color: function (colors) {
                    var colorList = [
                      '#006CFF',
                      '#60CDA0',
                      '#ED8884',
                      '#FF9F7F',
                      '#0096FF',
                      '#9FE6B8',
                      '#32C5E9',
                      '#1D9DFF',
                    ]
                    return colorList[colors.dataIndex % colorList.length]
                  },
                },
              },
              labelLine: {
                length: 6,
                length2: 8,
              },
              // 文字调整
              label: {
                fontSize: 10,
              },
            },
          ],
        }

        myChart.setOption(option)
      })()
    },
  },
  mounted() {
    this.echartInit()
  },
}
</script>

<style lang="scss" scoped>
.reports {
  .box-card {
    margin-top: 10px;

    .main {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 10px;
      width: 1000px;
      height: 800px;
      background-color: #000933;
      margin-top: 10px;

      .clumn {
        position: relative;
        width: 405px;
        height: 245px;
        background: url('~assets/img/line(1).png') no-repeat;
        border: 1px solid #042b4b;

        h2 {
          text-align: center;
          color: #fff;
          font-size: 15px;
          height: 38px;
          line-height: 38px;
        }

        .echart {
          width: 382px;
          height: 190px;
          margin: 0 auto;
        }

        &::before {
          position: absolute;
          top: 0;
          left: -1px;
          content: '';
          display: block;
          width: 10px;
          height: 10px;
          border-top: 2px solid #02a6b5;
          border-left: 2px solid #02a6b5;
        }

        &::after {
          position: absolute;
          top: 0;
          right: -1px;
          content: '';
          display: block;
          width: 10px;
          height: 10px;
          border-top: 2px solid #02a6b5;
          border-right: 2px solid #02a6b5;
        }

        .clumn-bar-line {
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 100%;
          z-index: 999;

          &::before {
            position: absolute;
            bottom: 0;
            left: -1px;
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            border-bottom: 2px solid #02a6b5;
            border-left: 2px solid #02a6b5;
          }

          &::after {
            position: absolute;
            bottom: 0;
            right: -1px;
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            border-bottom: 2px solid #02a6b5;
            border-right: 2px solid #02a6b5;
          }
        }
      }
    }
  }
}

.line1 a {
  text-decoration: none;
  color: #fff;
  margin-right: 10px;
}
</style>