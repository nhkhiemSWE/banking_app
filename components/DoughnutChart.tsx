'use client'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const data = {
    labels: [
      'Bank 1',
      'Bank 2',
      'Bank 3'
    ],
    datasets: [{
      label: 'Bank Accounts',
      data: [300, 50, 100],
      backgroundColor: [
        'oklch(from #0747b6 l c h)',
        'oklch(from #2265d8 l c h)',
        'oklch(from #2f91fa l c h)'
      ],
      hoverOffset: 4
    }]
  };
  return (
    <Doughnut
      data={data}
      options={{
        plugins: {
          legend: {
            display: false
          }
        },
        cutout: '60%'
      }}
    />
  )
}

export default DoughnutChart