<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useQuotesStore } from '@/stores/quotes'
import { startOfYear, endOfYear, eachMonthOfInterval, format, isSameMonth, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import BaseCard from '../common/BaseCard.vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const quotesStore = useQuotesStore()

const chartData = computed(() => {
  const now = new Date()
  const months = eachMonthOfInterval({
    start: startOfYear(now),
    end: endOfYear(now)
  })

  const labels = months.map(month => format(month, 'MMM', { locale: es }))
  
  const data = months.map(month => {
    return quotesStore.quotes
      .filter(quote => 
        quote.status === 'accepted' && 
        isSameMonth(parseISO(quote.issueDate), month)
      )
      .reduce((sum, quote) => sum + (quote.total || 0), 0)
  })

  return {
    labels,
    datasets: [
      {
        label: 'Ingresos',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
          gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
          return gradient;
        },
        borderColor: '#4f46e5',
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4f46e5',
        fill: true,
        tension: 0.4,
        data
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f3f4f6'
      },
      ticks: {
        callback: function(value) {
          return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD', notation: 'compact' }).format(value);
        }
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}
</script>

<template>
  <BaseCard title="Ingresos Mensuales" class="h-full">
    <div class="h-80 w-full">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </BaseCard>
</template>
