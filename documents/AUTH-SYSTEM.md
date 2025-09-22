# Authentication System Documentation

## Descripción
Sistema completo de autenticación con JWT, rutas protegidas y manejo de roles.

## Componentes Principales

### Login.tsx
- **Formulario de login**: Email y contraseña
- **Validaciones**: Campos requeridos, formato email
- **Estados**: Loading, error, success
- **Redirección**: Automática según rol (Admin/Home)
- **API**: `login()`

### AuthContext.tsx
- **Context Provider**: Estado global de autenticación
- **Funciones**: login, logout, checkAuth
- **Estado**: user, token, isAuthenticated, loading
- **Persistencia**: localStorage para token

## Rutas Protegidas

### ProtectedRoute.tsx
- **HOC**: Wrapper para rutas que requieren autenticación
- **Verificación**: Token válido y usuario autenticado
- **Redirección**: A login si no está autenticado
- **Loading**: Spinner mientras verifica token

### AdminRoute.tsx
- **HOC**: Wrapper para rutas administrativas
- **Verificación**: Usuario con rol ADMIN
- **Herencia**: Extiende ProtectedRoute
- **Redirección**: A home si no es admin

## Flujo de Autenticación

### 1. Login Process
```typescript
1. Usuario ingresa credenciales
2. Envío a API /auth/login
3. Recepción de JWT token
4. Almacenamiento en localStorage
5. Actualización de AuthContext
6. Redirección según rol
```

### 2. Token Management
```typescript
1. Token se adjunta automáticamente (axios interceptor)
2. Verificación en cada request
3. Renovación automática si es necesario
4. Logout automático si token expira
```

### 3. Route Protection
```typescript
1. Verificación de token en rutas protegidas
2. Validación de rol para rutas admin
3. Redirección apropiada si falla
4. Loading state durante verificación
```

## API Integration

### apiClient.ts
- **Configuración**: Base URL y headers
- **Interceptors**: 
  - Request: Adjunta token automáticamente
  - Response: Maneja errores de autenticación
- **Error Handling**: Logout automático en 401/403

### auth.ts
- **login()**: Autenticación de usuario
- **register()**: Registro de nuevo usuario (si aplica)
- **logout()**: Limpieza de sesión
- **verifyToken()**: Validación de token

## Estados de Autenticación

### Authenticated User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
}
```

### Auth Context State
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}
```

## Seguridad

### Token Storage
- **localStorage**: Persistencia entre sesiones
- **Limpieza**: Automática en logout/error
- **Validación**: Verificación de formato JWT

### Route Security
- **Verificación doble**: Context + API
- **Roles**: Diferenciación USER/ADMIN
- **Timeouts**: Manejo de tokens expirados

### Error Handling
- **401 Unauthorized**: Logout automático
- **403 Forbidden**: Redirección a home
- **Network errors**: Retry con backoff
- **Invalid token**: Limpieza y re-login

## UX Considerations

### Loading States
- Spinner durante verificación de token
- Skeleton screens en rutas protegidas
- Smooth transitions entre estados

### Error Messages
- Mensajes específicos por tipo de error
- Instrucciones claras para el usuario
- Opciones de recuperación

### Redirections
- Preservación de URL destino
- Redirección inteligente post-login
- Breadcrumbs para navegación

## Hooks Personalizados

### useAuth()
```typescript
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### useRequireAuth()
```typescript
const useRequireAuth = (redirectTo = '/login') => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, loading, navigate, redirectTo]);
  
  return { isAuthenticated, loading };
};
```

## Testing Considerations
- Mock AuthContext para tests
- Simulación de estados de autenticación
- Tests de rutas protegidas
- Verificación de redirections