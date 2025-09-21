# Home Page Documentation

## Descripción
Página principal pública donde los usuarios pueden ver eventos disponibles y realizar compras.

## Componentes Principales

### Home.tsx
- **Estado**: Maneja lista de eventos, loading y errores
- **Filtrado**: Solo muestra eventos futuros ordenados por fecha
- **Fallback**: Muestra evento dummy cuando no hay eventos reales

### Header.tsx
- Navegación principal con logo Casa Suiza
- Enlaces a secciones (Inicio, Eventos, Contacto)
- Responsive con menú hamburguesa en móvil

### EventCard.tsx
- Tarjeta de evento con imagen, título, fecha, ubicación
- Botón de compra que abre modal
- Indicadores de promoción y sold out
- Precio y capacidad disponible

### Footer.tsx
- Información de contacto
- Enlaces a redes sociales
- Copyright y datos de la empresa

### Subscriber.tsx
- Formulario de suscripción al newsletter
- Validación de email
- Integración con API de suscriptores

## Flujo de Compra

### PurchaseModal.tsx
- Modal principal de compra
- Integra formulario y resumen de pago
- Maneja estados de carga y errores

### PurchaseForm.tsx
- Formulario de datos del comprador
- Validaciones de campos requeridos
- Aplicación de cupones de descuento

### PaymentSummary.tsx
- Resumen del pedido
- Cálculo de totales con descuentos
- Información del evento seleccionado

### MercadoPagoPaymentBrick.tsx
- Integración con MercadoPago Payment Brick
- Procesamiento de pagos
- Redirección según resultado

## Estados de Pago

### success.tsx
- Página de confirmación de pago exitoso
- Información del ticket generado
- Enlace para descargar QR

### pending.tsx
- Página de pago pendiente
- Instrucciones para completar pago
- Información de seguimiento

### failure.tsx
- Página de error en el pago
- Opciones para reintentar
- Información de soporte

## Hooks Personalizados

### usePurchaseForm.ts
- Lógica de estado del formulario de compra
- Validaciones y manejo de errores
- Integración con API de órdenes

## API Integration
- `getEvents()`: Obtiene lista de eventos públicos
- `createOrder()`: Crea orden de compra
- `createPaymentPreference()`: Genera preferencia de MercadoPago
- `addSubscriber()`: Suscribe email al newsletter

## Características
- **Responsive**: Adaptado para móvil y desktop
- **Accesible**: Navegación por teclado y screen readers
- **Performance**: Lazy loading de imágenes
- **SEO**: Meta tags y estructura semántica