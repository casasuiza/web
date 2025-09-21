# Casa Suiza Frontend Documentation

## Arquitectura

### Stack Tecnológico
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Local state (useState, useEffect)

### Estructura del Proyecto
```
src/
├── api/             # Servicios HTTP y configuración
├── assets/          # Imágenes y recursos estáticos
├── pages/           # Páginas principales de la aplicación
│   ├── Admin/       # Panel administrativo
│   ├── Auth/        # Autenticación y rutas protegidas
│   └── Home/        # Página pública principal
├── App.tsx          # Configuración de rutas
└── main.tsx         # Punto de entrada
```

## Características Principales

### Autenticación
- JWT tokens almacenados en localStorage
- Rutas protegidas con componentes HOC
- Diferenciación entre usuarios y administradores

### Responsive Design
- Mobile-first con Tailwind CSS
- Tema personalizado con colores de Casa Suiza (#c9252d)
- Componentes adaptativos

### Integración de Pagos
- MercadoPago Payment Brick
- Flujo completo de compra
- Estados de pago (success, pending, failure)

## Páginas Principales

1. **Home**: Página pública con eventos y compras
2. **Admin**: Panel administrativo completo
3. **Auth**: Sistema de autenticación
4. **NotFound**: Página 404

## Comandos de Desarrollo

```bash
npm run dev    # Servidor de desarrollo
npm run build  # Build de producción
npm run preview # Preview del build
```

## Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```