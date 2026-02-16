# Guía de Pruebas Manuales - QuotePro

Esta guía detalla los pasos para verificar manualmente todas las funcionalidades de la aplicación QuotePro. Sigue estos casos de prueba para asegurar que el sistema funciona correctamente.

## 1. Autenticación

### Login
- [ ] **Acceso:** Navega a `/login`.
- [ ] **Credenciales:** Ingresa cualquier correo y contraseña (es una simulación).
- [ ] **Acción:** Haz clic en "Iniciar Sesión".
- [ ] **Resultado Esperado:** Redirección exitosa al Dashboard (`/`). Mensaje de bienvenida tipo "toast" en la esquina inferior derecha.
- [ ] **Persistencia:** Recarga la página. Deberías seguir autenticado.

### Logout
- [ ] **Acceso:** Desde cualquier página autenticada.
- [ ] **Acción:** Abre el menú de usuario en el header (esquina superior derecha) y selecciona "Cerrar Sesión", o usa el botón "Cerrar Sesión" en el sidebar.
- [ ] **Resultado Esperado:** Redirección a `/login`. Mensaje "Has cerrado sesión". Intentar acceder a `/` debe redirigir a `/login`.

## 2. Dashboard

- [ ] **Carga:** Verifica que se carguen las estadísticas (Total, Pendientes, Aceptadas, Ingresos).
- [ ] **Gráfico:** Verifica que el gráfico de "Ingresos Mensuales" se renderice.
- [ ] **Actividad Reciente:** Verifica la lista de actividades. Debe estar vacía si es una instalación limpia, o mostrar eventos si ya se crearon cotizaciones.
- [ ] **Cotizaciones Recientes:** Verifica la tabla. Si no hay datos, debe mostrar un mensaje "No hay cotizaciones".

## 3. Gestión de Cotizaciones

### Crear Cotización
- [ ] **Acceso:** Clic en "Nueva Cotización" desde el Dashboard o Sidebar.
- [ ] **Formulario:** Completa los campos obligatorios (Cliente, Proyecto).
- [ ] **Ítems:**
  - [ ] Agrega un servicio.
  - [ ] Agrega una descripción (textarea).
  - [ ] Cambia cantidad y precio. Verifica que el total de la fila se actualice.
  - [ ] Agrega un segundo ítem.
  - [ ] Elimina un ítem.
- [ ] **Totales:** Verifica el cálculo automático de Subtotal, Impuestos y Total.
- [ ] **Guardar:** Clic en "Guardar Cotización".
- [ ] **Resultado:** Redirección a `/quotes` (Mis Cotizaciones) con mensaje de éxito.

### Editar Cotización
- [ ] **Acceso:** Desde "Mis Cotizaciones" o el Dashboard, clic en el ícono de "Ojo" (Ver) para ir al preview, luego "Editar", o clic en el ícono de "Lápiz" en la lista.
- [ ] **Modificación:** Cambia algún dato (ej. nombre del proyecto o precio de un ítem).
- [ ] **Guardar:** Clic en "Actualizar Cotización".
- [ ] **Resultado:** Los cambios deben reflejarse en la lista y en la vista previa.

### Eliminar Cotización
- [ ] **Acción:** Clic en el ícono de "Basura" en una cotización de la lista.
- [ ] **Confirmación:** Debe aparecer un modal preguntando confirmación.
- [ ] **Resultado:** Al confirmar, la cotización desaparece de la lista.

## 4. Vista Previa y Acciones

- [ ] **Acceso:** Abre una cotización existente.
- [ ] **Visualización:** Verifica que todos los datos (cliente, ítems, totales, notas) se muestren correctamente según el diseño.
- [ ] **Simular Envío:**
  - [ ] Si el estado es "Borrador", clic en "Enviar al Cliente".
  - [ ] **Resultado:** Spinner de carga, mensaje de éxito, y el estado cambia a "Enviada" (badge azul).
- [ ] **Simular Vista:**
  - [ ] Si el estado es "Enviada", clic en "Simular Vista" (ícono ojo).
  - [ ] **Resultado:** El estado cambia a "Vista" (badge morado).
- [ ] **Firmar:**
  - [ ] Clic en "Firmar".
  - [ ] Dibuja una firma en el pad.
  - [ ] Guardar.
  - [ ] **Resultado:** El estado cambia a "Aceptada" (badge verde) y la firma aparece en el documento.
- [ ] **Imprimir/PDF:**
  - [ ] Clic en "Imprimir / PDF".
  - [ ] **Resultado:** Se abre el diálogo de impresión del navegador. Verifica que la sidebar y botones se oculten en la vista de impresión.

## 5. Plantillas

- [ ] **Acceso:** Navega a `/templates`.
- [ ] **Selección:** Haz clic en una plantilla diferente (ej. Creativo).
- [ ] **Verificación:** Ve a una cotización en "Vista Previa". El diseño (colores/fuentes) debe haber cambiado.

## 6. Perfil y Configuración

- [ ] **Acceso:** Navega a `/profile`.
- [ ] **Datos Personales:** Edita tu nombre o empresa. Guarda.
- [ ] **Firma Predeterminada:** Dibuja y guarda una firma.
- [ ] **Verificación:** Crea una nueva cotización. Verifica que los datos del emisor (tú) sean los actualizados.
- [ ] **Zona de Peligro:**
  - [ ] Clic en "Reiniciar Aplicación".
  - [ ] Acepta la confirmación.
  - [ ] **Resultado:** La aplicación se recarga y todos los datos (cotizaciones creadas, perfil modificado) vuelven al estado inicial (reset de fábrica).

## 7. Responsive (Móvil)

- [ ] **Vista:** Reduce el ancho del navegador a tamaño móvil (< 768px).
- [ ] **Sidebar:** El sidebar debe desaparecer y aparecer un botón de menú (hamburguesa) en el header.
- [ ] **Menú:** Clic en el menú hamburguesa. El sidebar debe abrirse como un drawer lateral.
- [ ] **Tablas:** Verifica que las tablas (en Dashboard y Crear Cotización) se puedan scrollear horizontalmente si es necesario.
