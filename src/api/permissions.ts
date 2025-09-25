export type UserRole = 'CREATOR' | 'ADMIN' | 'KITCHEN' | 'SERVICE' | 'USER';

export const roleLabels: Record<UserRole, string> = {
  CREATOR: 'Creador',
  ADMIN: 'Administrador', 
  KITCHEN: 'Cocina',
  SERVICE: 'Servicio',
  USER: 'Usuario',
};

export interface Permission {
  dashboard: boolean;
  events: boolean;
  addEvent: boolean;
  categories: boolean;
  artists: boolean;
  coupons: boolean;
  qrScanner: boolean;
  reports: boolean;
  users: boolean;
  tickets: boolean;
  settings: boolean;
  service: boolean;
  kitchen: boolean;
}

export const rolePermissions: Record<UserRole, Permission> = {
  CREATOR: {
    dashboard: true,
    events: true,
    addEvent: true,
    categories: true,
    artists: true,
    coupons: true,
    qrScanner: true,
    reports: true,
    users: true,
    tickets: true,
    settings: true,
    service: true,
    kitchen: true,
  },
  ADMIN: {
    dashboard: true,
    events: true,
    addEvent: true,
    categories: true,
    artists: true,
    coupons: true,
    qrScanner: true,
    reports: true,
    users: true,
    tickets: true,
    settings: true,
    service: true,
    kitchen: true,
  },
  KITCHEN: {
    dashboard: true,
    events: false,
    addEvent: false,
    categories: false,
    artists: false,
    coupons: false,
    qrScanner: false,
    reports: false,
    users: false,
    tickets: true,
    settings: false,
    service: false,
    kitchen: true,
  },
  SERVICE: {
    dashboard: false,
    events: false,
    addEvent: false,
    categories: false,
    artists: false,
    coupons: false,
    qrScanner: true,
    reports: false,
    users: false,
    tickets: true,
    settings: false,
    service: true,
    kitchen: false,
  },
  USER: {
    dashboard: false,
    events: false,
    addEvent: false,
    categories: false,
    artists: false,
    coupons: false,
    qrScanner: false,
    reports: false,
    users: false,
    tickets: false,
    settings: false,
    service: false,
    kitchen: false,
  },
};

export const hasPermission = (userRole: string | undefined, permission: keyof Permission): boolean => {
  if (!userRole) return false;
  const role = userRole.toUpperCase() as UserRole;
  return rolePermissions[role]?.[permission] || false;
};

export const canAccessAdmin = (userRole: string | undefined): boolean => {
  if (!userRole) return false;
  const role = userRole.toUpperCase() as UserRole;
  return ['CREATOR', 'ADMIN', 'KITCHEN', 'SERVICE'].includes(role);
};

export const getRoleColor = (userRole: string | undefined): string => {
  if (!userRole) return 'text-gray-500';
  const role = userRole.toUpperCase() as UserRole;
  
  const roleColors = {
    CREATOR: 'text-yellow-600',    // Dorado - Máximo nivel
    ADMIN: 'text-purple-600',     // Púrpura - Administrativo
    KITCHEN: 'text-orange-600',   // Naranja - Cocina/Calor
    SERVICE: 'text-blue-600',     // Azul - Servicio/Confianza
    USER: 'text-gray-500',        // Gris - Usuario regular
  };
  
  return roleColors[role] || 'text-gray-500';
};

export const getRoleBadgeColor = (userRole: string | undefined): string => {
  if (!userRole) return 'bg-gray-100 text-gray-600';
  const role = userRole.toUpperCase() as UserRole;
  
  const badgeColors = {
    CREATOR: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    ADMIN: 'bg-purple-100 text-purple-800 border-purple-200', 
    KITCHEN: 'bg-orange-100 text-orange-800 border-orange-200',
    SERVICE: 'bg-blue-100 text-blue-800 border-blue-200',
    USER: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  
  return badgeColors[role] || 'bg-gray-100 text-gray-600';
};

export const getRoleIcon = (userRole: string | undefined): string => {
  if (!userRole) return '👤';
  const role = userRole.toUpperCase() as UserRole;
  
  const roleIcons = {
    CREATOR: '👑',    // Corona - Creador
    ADMIN: '⚡',     // Rayo - Administrador
    KITCHEN: '👨‍🍳',   // Chef - Cocina
    SERVICE: '🛎️',    // Campana - Servicio
    USER: '👤',      // Usuario - Regular
  };
  
  return roleIcons[role] || '👤';
};