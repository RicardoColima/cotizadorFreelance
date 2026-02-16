# QuotePro - Sistema de Cotizaciones para Freelancers

QuotePro es una aplicación web SaaS moderna para la gestión de cotizaciones profesionales, construida con Vue 3, Vite, TailwindCSS y Pinia. Esta aplicación simula un entorno de producción completo, utilizando **LocalStorage** para la persistencia de datos, eliminando la necesidad de un backend real para esta demostración.

## 🚀 Características Principales

- **Dashboard Interactivo:** Vista general de cotizaciones, ingresos mensuales (Chart.js) y línea de tiempo de actividades recientes.
- **Gestión de Cotizaciones:**
  - Creación y edición de cotizaciones con ítems dinámicos.
  - Cálculos automáticos de subtotales, impuestos y descuentos.
  - Estados de cotización: Borrador, Enviada, Vista, Aceptada, Rechazada.
- **Vista Previa Profesional:**
  - Visualización exacta de cómo verá el cliente la cotización.
  - **Simulación de Envío:** Envía cotizaciones por correo (simulado).
  - **Simulación de Vista de Cliente:** Simula cuando un cliente abre el enlace.
  - **Firma Digital:** Pad de firma digital integrado para aceptación de propuestas.
  - **Generación de PDF:** Impresión profesional y descarga de PDF (vía navegador).
- **Plantillas:** Selección de diseños (Minimalista, Creativo, Corporativo).
- **Perfil de Usuario:**
  - Configuración de datos del negocio, logo y moneda.
  - Configuración de impuestos y notas predeterminadas.
  - Gestión de firma predeterminada.
  - **Zona de Peligro:** Reinicio completo de la aplicación (borrado de datos).
- **Notificaciones:** Sistema de notificaciones toast y centro de notificaciones en el header.
- **Autenticación Simulada:** Login/Logout con protección de rutas.
- **Diseño Responsive:** Sidebar móvil y adaptación a todos los dispositivos.

## 🛠️ Tecnologías

- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **Estado Global:** Pinia
- **Router:** Vue Router
- **Estilos:** TailwindCSS v4
- **Iconos:** Lucide Vue
- **Componentes UI:** Headless UI
- **Gráficos:** Chart.js + vue-chartjs
- **Utilidades:** Date-fns, VueUse

## 📦 Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd cotizadorfreelance
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Generalmente en `http://localhost:5173` o el puerto que indique la terminal.

## 🔐 Credenciales de Acceso (Demo)

La aplicación cuenta con un sistema de autenticación simulado. Puedes usar las credenciales predeterminadas:

- **Email:** `demo@freelancer.com`
- **Contraseña:** `password` (o cualquier otra, es una demo)

## 📂 Estructura del Proyecto

```
src/
├── assets/          # Estilos (Tailwind) y recursos
├── components/      # Componentes Vue
│   ├── common/      # Botones, inputs, modales, tarjetas (UI Kit)
│   ├── dashboard/   # Gráficos y timeline
│   ├── layout/      # Sidebar, Header, Layout principal
│   └── quotes/      # Tablas y badges específicos
├── router/          # Configuración de rutas y guards
├── stores/          # Gestión de estado (Pinia) - Data simulada
├── utils/           # Helpers de formato
├── views/           # Vistas principales (Páginas)
└── App.vue          # Componente raíz
```

## 📝 Notas de Desarrollo
- **Persistencia:** Todos los datos (cotizaciones, perfil, actividad) se guardan en el `localStorage` del navegador. Si borras el caché, volverás al estado inicial (datos de ejemplo).
- **Simulaciones:**
  - El envío de correos es una simulación visual con timers.
  - La generación de PDF utiliza el diálogo de impresión nativo del navegador (`window.print()`) con estilos CSS específicos para ocultar la interfaz de usuario (`@media print`).

---
Desarrollado con ❤️ para freelancers.
