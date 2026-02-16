import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useQuotesStore = defineStore('quotes', () => {
  console.log('Quotes store initializing...')
  const quotes = ref([])
  const activities = ref([])

  // Helper functions defined BEFORE usage
  const saveToLocalStorage = () => {
    localStorage.setItem('quotes', JSON.stringify(quotes.value))
  }

  const saveActivitiesToLocalStorage = () => {
    localStorage.setItem('activities', JSON.stringify(activities.value))
  }

  const addActivity = (type, message, quoteId = null) => {
    activities.value.unshift({
      id: Date.now(),
      type,
      message,
      date: new Date().toISOString(),
      quoteId
    })
    saveActivitiesToLocalStorage()
  }
  
  // Initialization Logic
  if (localStorage.getItem('quotes')) {
    quotes.value = JSON.parse(localStorage.getItem('quotes'))
  } else {
    // Add sample data for demonstration
    quotes.value = [
      {
        id: '12345678',
        clientName: 'Tech Solutions Inc.',
        projectName: 'Rediseño de E-commerce',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'sent',
        total: 4500.00,
        currency: 'USD',
        items: [
          { name: 'Diseño UX/UI', quantity: 1, price: 1500, total: 1500 },
          { name: 'Desarrollo Frontend', quantity: 1, price: 2000, total: 2000 },
          { name: 'Integración Backend', quantity: 1, price: 1000, total: 1000 }
        ],
        subtotal: 4500,
        taxAmount: 0,
        discountAmount: 0,
        taxRate: 0,
        discountRate: 0
      },
      {
        id: '87654321',
        clientName: 'Maria González',
        projectName: 'Sitio Web Personal',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        issueDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'accepted',
        total: 1200.00,
        currency: 'USD',
        items: [
          { name: 'Diseño y Desarrollo', quantity: 1, price: 1200, total: 1200 }
        ],
        subtotal: 1200,
        taxAmount: 0,
        discountAmount: 0,
        taxRate: 0,
        discountRate: 0
      }
    ]
    saveToLocalStorage()
  }

  // Load activities
  if (localStorage.getItem('activities')) {
    activities.value = JSON.parse(localStorage.getItem('activities'))
  } else {
    // Sample activities
    activities.value = [
      {
        id: 1,
        type: 'accepted',
        message: 'Cotización aceptada por Maria González',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        quoteId: '87654321'
      },
      {
        id: 2,
        type: 'sent',
        message: 'Cotización enviada a Tech Solutions Inc.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        quoteId: '12345678'
      }
    ]
    saveActivitiesToLocalStorage()
  }

  // Actions
  const addQuote = (quote) => {
    const id = crypto.randomUUID()
    quotes.value.push({
      ...quote,
      id,
      createdAt: new Date().toISOString(),
      status: 'draft'
    })
    saveToLocalStorage()
    addActivity('created', `Nueva cotización creada para ${quote.clientName}`, id)
  }

  const updateQuote = (id, updatedData) => {
    const index = quotes.value.findIndex(q => q.id === id)
    if (index !== -1) {
      const oldStatus = quotes.value[index].status
      quotes.value[index] = { ...quotes.value[index], ...updatedData }
      saveToLocalStorage()

      if (updatedData.status && updatedData.status !== oldStatus) {
        let message = ''
        if (updatedData.status === 'sent') message = `Cotización enviada a ${quotes.value[index].clientName}`
        if (updatedData.status === 'accepted') message = `Cotización aceptada por ${quotes.value[index].clientName}`
        if (updatedData.status === 'rejected') message = `Cotización rechazada por ${quotes.value[index].clientName}`
        if (updatedData.status === 'viewed') message = `Cotización vista por ${quotes.value[index].clientName}`
        
        if (message) addActivity(updatedData.status, message, id)
      }
    }
  }

  const deleteQuote = (id) => {
    const quote = quotes.value.find(q => q.id === id)
    quotes.value = quotes.value.filter(q => q.id !== id)
    saveToLocalStorage()
    if (quote) {
      addActivity('deleted', `Cotización para ${quote.clientName} eliminada`)
    }
  }

  const getQuoteById = (id) => {
    return quotes.value.find(q => q.id === id)
  }

  const stats = computed(() => {
    const total = quotes.value.length
    const pending = quotes.value.filter(q => q.status === 'sent').length
    const accepted = quotes.value.filter(q => q.status === 'accepted').length
    const revenue = quotes.value
      .filter(q => q.status === 'accepted')
      .reduce((sum, q) => sum + (q.total || 0), 0)
    
    return { total, pending, accepted, revenue }
  })

  return {
    quotes,
    activities,
    addQuote,
    updateQuote,
    deleteQuote,
    getQuoteById,
    stats,
    addActivity
  }
})
