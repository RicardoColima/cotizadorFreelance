import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTemplatesStore = defineStore('templates', () => {
  const templates = ref([
    {
      id: 'minimal',
      name: 'Minimalista',
      description: 'Diseño limpio con mucho espacio en blanco',
      preview: 'bg-white border-gray-200',
      active: true
    },
    {
      id: 'creative',
      name: 'Creativo',
      description: 'Colores vibrantes y tipografía moderna',
      preview: 'bg-indigo-50 border-indigo-200',
      active: false
    },
    {
      id: 'corporate',
      name: 'Corporativo',
      description: 'Serio y profesional, ideal para empresas',
      preview: 'bg-slate-50 border-slate-300',
      active: false
    }
  ])

  // Load from LocalStorage
  const savedTemplateId = localStorage.getItem('currentTemplateId')
  if (savedTemplateId) {
    const found = templates.value.find(t => t.id === savedTemplateId)
    if (found) {
      templates.value.forEach(t => t.active = false)
      found.active = true
    }
  }

  const currentTemplate = ref(templates.value.find(t => t.active) || templates.value[0])

  const setTemplate = (id) => {
    templates.value.forEach(t => t.active = (t.id === id))
    currentTemplate.value = templates.value.find(t => t.id === id)
    localStorage.setItem('currentTemplateId', id)
  }

  return {
    templates,
    currentTemplate,
    setTemplate
  }
})
