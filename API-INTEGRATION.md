# API Integration Documentation

## Descripción
Configuración y servicios para integración con el backend de Casa Suiza.

## Configuración Base

### apiClient.ts
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://backend-web-t0x2.onrender.com/api/v1";

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Interceptors
- **Request**: Adjunta JWT token automáticamente
- **Response**: Maneja errores globalmente
- **Error Handling**: Logout en 401, redirección en 403

## Servicios por Módulo

### auth.ts
```typescript
// Autenticación de usuarios
login(email: string, password: string)
register(userData: RegisterData)
logout()
verifyToken()
```

### events.ts
```typescript
// Gestión de eventos
getEvents(): Promise<EventData[]>
getEventById(id: string): Promise<EventData>
createEvent(event: EventData | FormData): Promise<EventData>
updateEvent(id: string, event: EventData | FormData): Promise<EventData>
deleteEvent(id: string): Promise<{message: string}>
```

### category.ts
```typescript
// Gestión de categorías
getCategories(): Promise<Category[]>
createCategory(category: CategoryData): Promise<Category>
updateCategory(id: string, category: CategoryData): Promise<Category>
deleteCategory(id: string): Promise<{message: string}>
```

### users.ts
```typescript
// Gestión de usuarios (Admin)
getUsers(params?: UserFilters): Promise<User[]>
getUserById(id: string): Promise<User>
updateUser(id: string, userData: UpdateUserData): Promise<User>
deleteUser(id: string): Promise<{message: string}>
```

### tickets.ts
```typescript
// Gestión de tickets
getTickets(): Promise<Ticket[]>
getTicketById(id: string): Promise<Ticket>
createTicket(ticketData: CreateTicketData): Promise<Ticket>
```

### order.ts
```typescript
// Gestión de órdenes
getOrders(): Promise<Order[]>
getOrderById(id: string): Promise<Order>
createOrder(orderData: CreateOrderData): Promise<Order>
updateOrderStatus(id: string, status: OrderStatus): Promise<Order>
```

### payments.ts
```typescript
// Integración con MercadoPago
createPaymentPreference(orderId: string): Promise<PaymentPreference>
getPaymentStatus(paymentId: string): Promise<PaymentStatus>
```

### subscribers.ts
```typescript
// Newsletter
addSubscriber(email: string): Promise<{message: string}>
getSubscribers(): Promise<Subscriber[]> // Admin only
removeSubscriber(id: string): Promise<{message: string}> // Admin only
```

### reports.ts
```typescript
// Reportes (Admin)
getSalesReport(filters: ReportFilters): Promise<SalesReport>
getEventReport(eventId: string): Promise<EventReport>
exportReport(type: string, filters: ReportFilters): Promise<Blob>
```

### dashboard.ts
```typescript
// Dashboard stats (Admin)
getDashboardStats(): Promise<DashboardStats>
```

## Tipos de Datos

### EventData
```typescript
interface EventData {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  date: string; // ISO string
  capacity: number | null;
  promo: boolean | null;
  soldOut: boolean | null;
  price: number;
  sold: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string | null;
  organizerId: string | null;
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Order
```typescript
interface Order {
  id: string;
  userId: string;
  eventId: string;
  quantity: number;
  totalPrice: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## Manejo de Errores

### Error Types
```typescript
interface APIError {
  message: string;
  status: number;
  code?: string;
}
```

### Error Handling Patterns
```typescript
try {
  const data = await apiCall();
  return data;
} catch (error) {
  if (error.response?.status === 401) {
    // Logout automático
    logout();
  } else if (error.response?.status === 403) {
    // Redirección a home
    navigate('/');
  } else {
    // Mostrar error al usuario
    setError(error.message);
  }
  throw error;
}
```

## File Upload

### Multipart Form Data
```typescript
const formData = new FormData();
formData.append('title', eventData.title);
formData.append('image', file);

await createEvent(formData);
```

### Headers para Upload
```typescript
headers: {
  'Content-Type': 'multipart/form-data'
}
```

## Paginación

### Query Parameters
```typescript
interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

### Response Format
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## Caching Strategy

### Local Storage
- Token de autenticación
- Preferencias de usuario
- Datos de sesión temporal

### Memory Cache
- Lista de categorías (raramente cambian)
- Datos de usuario actual
- Configuración de la app

## Environment Variables

### Development
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Production
```env
VITE_API_BASE_URL=https://backend-web-t0x2.onrender.com/api/v1
```

## Testing

### Mock API Calls
```typescript
jest.mock('../api/events', () => ({
  getEvents: jest.fn(() => Promise.resolve(mockEvents)),
  createEvent: jest.fn(() => Promise.resolve(mockEvent)),
}));
```

### API Testing
- Unit tests para cada servicio
- Integration tests para flujos completos
- Error handling tests
- Mock responses para diferentes escenarios