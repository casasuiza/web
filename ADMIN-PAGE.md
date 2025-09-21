# Admin Page Documentation

## Descripción
Panel administrativo completo para gestión de eventos, usuarios, reportes y configuraciones.

## Estructura Principal

### Admin.tsx
- Layout principal con sidebar y contenido
- Routing interno entre secciones
- Estado global de navegación

### Sidebar.tsx
- Navegación lateral con iconos
- Secciones: Dashboard, Eventos, Usuarios, Reportes, Configuración
- Indicador de sección activa
- Botón de logout

### Header.tsx
- Barra superior con título de sección
- Información del usuario logueado
- Breadcrumbs de navegación

## Secciones del Admin

### Dashboard.tsx
- **Métricas principales**: Eventos activos, tickets vendidos, usuarios, ingresos
- **Gráficos**: Ventas por período, eventos más populares
- **Resumen**: Actividad reciente y alertas
- **API**: `getDashboardStats()`

### Events.tsx
- **Lista de eventos**: Tabla con filtros y paginación
- **Acciones**: Crear, editar, eliminar eventos
- **Estados**: Activo/inactivo, promoción, sold out
- **Búsqueda**: Por título, fecha, categoría
- **API**: `getEvents()`, `deleteEvent()`

### AddEventForm.tsx
- **Formulario completo**: Título, descripción, fecha, ubicación
- **Upload de imagen**: Drag & drop con preview
- **Validaciones**: Campos requeridos, formato de fecha
- **Categorías**: Selector de categoría existente
- **API**: `createEvent()`, `updateEvent()`

### Users.tsx
- **Gestión de usuarios**: Lista con roles y estados
- **Filtros**: Por rol (ADMIN/USER), estado activo
- **Acciones**: Editar, desactivar, cambiar rol
- **Búsqueda**: Por email o nombre
- **API**: `getUsers()`, `updateUser()`, `deleteUser()`

### UserModal.tsx
- **Edición de usuario**: Formulario modal
- **Campos**: Email, nombre, apellido, rol
- **Validaciones**: Email único, campos requeridos
- **Estados**: Activo/inactivo

### CategoryManagement.tsx
- **CRUD de categorías**: Crear, editar, eliminar
- **Lista**: Tabla con nombre y descripción
- **Validaciones**: Nombre único
- **API**: `getCategories()`, `createCategory()`, `updateCategory()`, `deleteCategory()`

### AddCategoryForm.tsx
- **Formulario simple**: Nombre y descripción
- **Validaciones**: Nombre requerido
- **Estados**: Crear/editar modo

### Tickets.tsx
- **Gestión de tickets**: Lista de todos los tickets vendidos
- **Filtros**: Por evento, estado, fecha
- **Información**: Comprador, evento, estado de pago
- **Acciones**: Ver detalles, reenviar QR
- **API**: `getTickets()`

### Reports.tsx
- **Reportes de ventas**: Por período, evento, categoría
- **Gráficos**: Ingresos, tickets vendidos, tendencias
- **Exportación**: CSV, PDF
- **Filtros**: Fecha inicio/fin, evento específico
- **API**: `getSalesReport()`

### Settings.tsx
- **Configuración general**: Datos de la empresa
- **Integración**: Configuración MercadoPago
- **Email**: Configuración SMTP
- **Cupones**: Gestión de códigos de descuento

## Componentes Compartidos

### ConfirmationModal.tsx
- Modal de confirmación para acciones destructivas
- Personalizable con título y mensaje
- Botones de confirmar/cancelar

## Características de Seguridad

### Autenticación
- Verificación de token JWT en cada request
- Redirección automática si token expira
- Verificación de rol ADMIN

### Autorización
- Rutas protegidas con `AdminRoute`
- Verificación de permisos por sección
- Ocultación de funciones según rol

## Estados y Manejo de Errores
- Loading states en todas las operaciones
- Mensajes de error específicos
- Confirmaciones de acciones exitosas
- Rollback en caso de errores

## Performance
- Paginación en listas largas
- Lazy loading de componentes
- Debounce en búsquedas
- Cache de datos frecuentes

## Responsive Design
- Sidebar colapsable en móvil
- Tablas con scroll horizontal
- Formularios adaptados a pantalla pequeña
- Touch-friendly en dispositivos móviles