import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { serviceOrdersApi, type ServiceOrder } from '../../api/serviceOrders';

const Kitchen: React.FC = () => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadKitchenOrders();
    const interval = setInterval(loadKitchenOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadKitchenOrders = async () => {
    try {
      setLoading(true);
      const response = await serviceOrdersApi.getKitchenOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading kitchen orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await serviceOrdersApi.updateStatus(orderId, status);
      loadKitchenOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PREPARATION':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'READY':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="w-5 h-5" />;
      case 'IN_PREPARATION':
        return <Clock className="w-5 h-5" />;
      case 'READY':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTimeDifference = (dateString: string) => {
    const now = new Date();
    const orderTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    return diffInMinutes;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Cocina</h1>
            <p className="text-gray-600">Gestión de pedidos de comida</p>
          </div>
          <button
            onClick={loadKitchenOrders}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <UtensilsCrossed className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pedidos pendientes</h3>
          <p className="text-gray-600">Los nuevos pedidos de comida aparecerán aquí</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const timeDiff = getTimeDifference(order.createdAt);
            const isUrgent = timeDiff > 15;
            
            return (
              <div
                key={order.id}
                className={`bg-white rounded-lg shadow-lg border-2 ${
                  isUrgent ? 'border-red-300' : 'border-gray-200'
                } p-6`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Mesa {order.table.number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Pedido: {formatTime(order.createdAt)}
                    </p>
                    <p className={`text-sm ${isUrgent ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                      Hace {timeDiff} minutos
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium">
                      {order.status === 'PENDING' ? 'Pendiente' :
                       order.status === 'IN_PREPARATION' ? 'En Preparación' :
                       order.status === 'READY' ? 'Listo' : order.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-medium">${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Notas:</strong> {order.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-bold text-lg">Total: ${order.total}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'IN_PREPARATION')}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Iniciar Preparación
                    </button>
                  )}
                  
                  {order.status === 'IN_PREPARATION' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'READY')}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Marcar como Listo
                    </button>
                  )}

                  {order.status === 'READY' && (
                    <div className="flex-1 bg-green-100 text-green-800 py-2 px-4 rounded-lg text-center font-medium">
                      Listo para Retirar
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Kitchen;