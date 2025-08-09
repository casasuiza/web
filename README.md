# 🎉 Casa Suiza Web – Frontend

**Casa Suiza Web** es una aplicación moderna desarrollada con **Vite + React** y estilizada con **Tailwind CSS**. Permite mostrar los próximos eventos y vender entradas online desde una interfaz rápida, accesible y responsiva.

## 🧩 Tecnologías utilizadas

- **React** – UI basada en componentes  
- **Vite** – Entorno de desarrollo moderno y veloz  
- **Tailwind CSS** – Utilidades de estilos rápidas y adaptables  
- **React Router DOM** – Navegación y enrutamiento  
- **TypeScript** – Tipado estático

## 🗂️ Estructura del proyecto  
```bash 
src/
├── assets/                     # Imágenes, íconos, etc.
├── pages/
│   ├── Auth/                   # Autenticación y protección de rutas
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── Admin.tsx
│   ├── Admin/                  # Panel de administración
│   │   ├── components/
│   │   │   ├── AddEventForm.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Users.tsx
│   │   │   └── Sidebar.tsx
│   │   └── Admin.tsx
│   ├── Home/                   # Página de inicio
│   │   ├── components/
│   │   │   ├── modals/
│   │   │   │   └── BuyModal.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── EventCard.tsx
│   │   │   └── Footer.tsx
│   └── Home.tsx
├── App.tsx                     # Enrutador principal
└── main.tsx                    # Punto de entrada
```

## 🎨 Paleta de colores

| Color         | Hex       |
|---------------|-----------|
| Rojo principal| `#c9252d` |
| Blanco        | `#FFFFFF` |
| Negro         | `#000000` |
| Azul oscuro   | `#2C3E50` |
| Gris claro    | `#F7F7F7` |

## 🌐 Rutas definidas

- `/` – Página principal con próximos eventos  
- `/admin` – Panel de administración (requiere autenticación)  
- Rutas protegidas mediante `ProtectedRoute`  

## ✅ Próximos pasos

- [ ] Conectar con API backend para cargar eventos dinámicos  
- [ ] Crear página de detalle de evento  
- [ ] Configurar panel de administrador completamente  
- [ ] Integrar con **MercadoPago** para venta de entradas  

👉 **No dudes en escribirme**. ¡Estoy para colaborar!