import {
  Chart,
  Colors,
  BarController,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Legend,
  Title,
  DoughnutController,
  ArcElement,
  TimeScale
} from 'chart.js'

import ChartDataLabels from 'chartjs-plugin-datalabels'
import 'chartjs-adapter-date-fns'
import annotationPlugin from 'chartjs-plugin-annotation'

import axios from 'axios'

Chart.register(
  Colors,
  BarController,
  LineController,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Title,
  DoughnutController,
  ArcElement,
  TimeScale,
  annotationPlugin
)

const colourMap = {
  'CHEDA Linked': 'rgb(128,0,128)',
  'CHEDA Not Linked': 'rgb(218,112,214)',
  'CHEDD Linked': 'rgb(0,0,255)',
  'CHEDD Not Linked': 'rgb(0,191,255)',
  'CHEDP Linked': 'rgb(139,69,19)',
  'CHEDP Not Linked': 'rgb(244,164,96)',
  'CHEDPP Linked': 'rgb(0,255,0)',
  'CHEDPP Not Linked': 'rgb(173,255,47)',
  Linked: 'rgb(128,128,128)',
  'Not Linked': 'rgb(224,224,224)',
  1: 'rgb(169,169,169)',
  2: 'rgb(105,105,105)',
  3: 'rgb(85,85,85)',
  4: 'rgb(45,45,45)',
  5: 'rgb(25,25,25)'
}

export const setup = async function () {
  await (async function () {
    const url = `/auth/proxy/analytics/dashboard`

    const result = await axios.get(url)

    createDoughnut(
      'lastMonthImportNotificationsByTypeAndStatus',
      'Last Month',
      'Import Notifications Created Last Month By CHED Type & Link Status',
      result.data.lastMonthImportNotificationsByTypeAndStatus
    )
    createDoughnut(
      'lastMonthMovementsByStatus',
      'Last Month',
      'Movements Created Last Month By Link Status',
      result.data.lastMonthMovementsByStatus
    )

    createImportNotificationsLinkingByArrival(
      result.data.importNotificationLinkingByArrival
    )
    createImportNotificationsLinkingByCreated(
      result.data.importNotificationLinkingByCreated
    )

    createDateLineChart(
      'last24HoursImportNotificationsLinkingByCreated',
      'Import Notifications Created Last 24 Hours By CHED Type & Link Status',
      'Created Time',
      'hour',
      result.data.last24HoursImportNotificationsLinkingByCreated
    )

    createDateLineChart(
      'last24HoursMovementsLinkingByCreated',
      'Movements Created Last 24 Hours By Link Status',
      'Created Time',
      'hour',
      result.data.last24HoursMovementsLinkingByCreated
    )

    createDoughnut(
      'last7DaysImportNotificationsLinkingStatus',
      'Last 7 Days',
      'Import Notifications Created Last 7 Days By CHED Type & Link Status',
      result.data.last7DaysImportNotificationsLinkingStatus
    )
    createDoughnut(
      'last24HoursImportNotificationsLinkingStatus',
      'Last 24 Hours',
      'Import Notifications Created Last 24 Hours By CHED Type & Link Status',
      result.data.last24HoursImportNotificationsLinkingStatus
    )

    createDateLineChart(
      'movementsLinkingByCreated',
      'Movements By Link Status',
      'Created Date',
      'day',
      result.data.movementsLinkingByCreated
    )

    // createDateLineChart(
    //   'movementsLinkingByArrival',
    //   'Movements By Link Status',
    //   'Arrival Date',
    //   'day',
    //   result.data.movementsLinkingByArrival
    // )

    createLineChart(
      'lastMonthMovementsByItemCount',
      'Last Months Movements By Item Count',
      'Item Count',
      'count',
      result.data.lastMonthMovementsByItemCount
    )

    createLineChart(
      'lastMonthImportNotificationsByCommodityCount',
      'Last Months Import Notifications By Commodity Count',
      'Commodity Count',
      'count',
      result.data.lastMonthImportNotificationsByCommodityCount
    )

    createLineChart(
      'lastMonthMovementsByUniqueDocumentReferenceCount',
      'Last Months Movements By Unique Document Reference Count',
      'Item Count',
      'count',
      result.data.lastMonthMovementsByUniqueDocumentReferenceCount
    )

    createDoughnut(
      'lastMonthUniqueDocumentReferenceByMovementCount',
      'Last Month',
      'Movements Created Last Month Document References By Movement Count',
      result.data.lastMonthUniqueDocumentReferenceByMovementCount
    )
  })()
}

/**
 * @param {any} data
 */
function createImportNotificationsLinkingByCreated(data) {
  createDateLineChart(
    'importNotificationsLinkingByCreated',
    'Import Notifications Created Last Month By CHED Type & Link Status',
    'Created Date',
    'day',
    data
  )
}

/**
 * @param {any} data
 */
function createImportNotificationsLinkingByArrival(data) {
  createDateLineChart(
    'importNotificationsLinkingByArrival',
    'Import Notifications Arriving By CHED Type & Link Status',
    'Arrival Date',
    'day',
    data
  )
}

function logCanvasDimensions(elementId, canvas) {
  const width = canvas.getBoundingClientRect().width
  const height = canvas.getBoundingClientRect().height

  console.log('Canvas %s width=%s, height=%s', elementId, width, height) // eslint-disable-line no-console
}

function noData(elementId, canvas) {
  console.log('No data for %s on %s', elementId, canvas) // eslint-disable-line no-console
}

/**
 * @param {string} elementId
 * @param {string} title
 * @param {string} dateFieldLabel
 * @param {string} xAxisUnit
 * @param {any[]} data
 */
function createDateLineChart(
  elementId,
  title,
  dateFieldLabel,
  xAxisUnit,
  data
) {
  const canvas = document.getElementById(elementId)
  logCanvasDimensions(elementId, canvas)

  if (!data?.series?.length) {
    noData(elementId, canvas)

    return
  }

  data = data.series

  const datasets = data.map((r) => ({
    label: r.name,
    borderColor: colourMap[r.name],
    data: r.periods.map((d) => d.value)
  }))

  /* eslint-disable no-new */ // @ts-expect-error: code from chart.js
  new Chart(document.getElementById(elementId), {
    type: 'line',
    data: {
      labels: data[0].periods.map((d) => d.period),
      datasets
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          position: 'top',
          text: title
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: dateFieldLabel
          },
          type: 'time',
          time: {
            unit: xAxisUnit
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Count'
          }
        }
      }
    }
  })
}

/**
 * @param {string} elementId
 * @param {string} title
 * @param {string} xAxisLabel
 * @param {string} xAxisUnit
 * @param {any[]} data
 */
function createLineChart(elementId, title, xAxisLabel, xAxisUnit, data) {
  const canvas = document.getElementById(elementId)
  logCanvasDimensions(elementId, canvas)

  if (!data?.length) {
    noData(elementId, canvas)

    return
  }

  // data = data.slice(-1);

  const datasets = data.map((r) => ({
    label: r.name,
    borderColor: colourMap[r.name],
    data: r.results.map((r) => r.value)
  }))

  const labels = data[0].results.map((d) => d.dimension)

  /* eslint-disable no-new */ // @ts-expect-error: code from chart.js
  new Chart(document.getElementById(elementId), {
    type: 'line',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          position: 'top',
          text: title
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: xAxisLabel
          },
          // type: 'time',
          time: {
            unit: xAxisUnit
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Count'
          }
        }
      }
    }
  })
}

function createDoughnut(elementId, period, title, data) {
  const canvas = document.getElementById(elementId)
  logCanvasDimensions(elementId, canvas)
  if (!data) {
    noData(elementId, canvas, title)
    return
  }

  data = data.values

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: title,
        data: Object.values(data),
        backgroundColor: Object.keys(data).map((k) => colourMap[k]),
        hoverOffset: 4
      }
    ]
  }

  const sum = Object.values(data).reduce((a, b) => a + b, 0)

  /* eslint-disable no-new */ // @ts-expect-error: code from chart.js
  new Chart(canvas, {
    type: 'doughnut',
    data: chartData,
    plugins: [ChartDataLabels],
    options: {
      maintainAspectRatio: false,
      responsive: true,

      // hover: {
      //   mode: 'nearest',
      //   intersect: false,
      //   onHover: function (e, item) {
      //     console.log('onhover', item)
      //     if (item.length) {
      //       const data = item[0]._chart.config.data.datasets[0].data[item[0]._index];
      //       console.log(item, data);
      //     }
      //   }
      // },
      plugins: {
        legend: {
          // display: false
          position: 'left'
        },
        tooltip: {
          enabled: true
        },
        datalabels: {
          color: '#ffffff',
          // font: {
          //   size: 5
          // },
          // 'font.size' : 5,
          formatter: function (value) {
            return value.toLocaleString()
          }
        },
        title: {
          display: true,
          position: 'top',
          text: title
        },
        annotation: {
          annotations: {
            dLabel: {
              type: 'doughnutLabel',
              content: () => ['Total', sum.toLocaleString(), period],
              font: [{ size: 30 }, { size: 50 }, { size: 30 }],
              color: ['grey', 'black', 'grey']
            }
          }
        }
      }
    }
  })
}
