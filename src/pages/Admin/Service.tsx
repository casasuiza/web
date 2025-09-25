import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Coffee, UtensilsCrossed } from 'lucide-react';
import { tablesApi, type Table } from '../../api/tables';
import { serviceOrdersApi, type ServiceOrder } from '../../api/serviceOrders';

const Service: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showTableForm, setShowTableForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [newTable, setNewTable] = useState({ number: 0, positionX: 0, positionY: 0 });
  const [newOrder, setNewOrder] = useState({
    tableId: '',
    type: 'FOOD' as 'FOOD' | 'DRINK',
    items: [{ name: '', price: 0, quantity: 1 }],
    notes: ''
  });

  useEffect(() => {
    loadTables();
    loadOrders();
  }, []);

  const loadTables = async () => {
    try {
      const response = await tablesApi.getAll();
      setTables(response.data);
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await serviceOrdersApi.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleCreateTable = async () => {
    try {
      await tablesApi.create(newTable);
      setNewTable({ number: 0, positionX: 0, positionY: 0 });
      setShowTableForm(false);
      loadTables();
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  const handleCreateOrder = async () => {
    try {
      const total = newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      await serviceOrdersApi.create({
        ...newOrder,
        items: newOrder.items,
        total
      });
      setNewOrder({
        tableId: '',
        type: 'FOOD',
        items: [{ name: '', price: 0, quantity: 1 }],
        notes: ''
      });
      setShowOrderForm(false);
      loadOrders();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const addOrderItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { name: '', price: 0, quantity: 1 }]
    });
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Servicio</h1>
        <p className="text-gray-600">Gestión de mesas y pedidos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mesas</h2>
            <button
              onClick={() => setShowTableForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Agregar Mesa
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`p-4 border-2 rounded-lg cursor-pointer text-center ${
                  selectedTable?.id === table.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTable(table)}
              >
                <div className="text-lg font-semibold">Mesa {table.number}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pedidos Activos</h2>
            <button
              onClick={() => setShowOrderForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Nuevo Pedido
            </button>
          </div>

          <div className="space-y-3">
            {orders.filter(order => order.status !== 'DELIVERED').map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {order.type === 'FOOD' ? (
                      <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Coffee className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="font-semibold">Mesa {order.table.number}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'IN_PREPARATION' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'READY' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Total: ${order.total}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showTableForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Agregar Mesa</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Número de Mesa</label>
                <input
                  type="number"
                  value={newTable.number}
                  onChange={(e) => setNewTable({...newTable, number: parseInt(e.target.value)})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Posición X</label>
                  <input
                    type="number"
                    value={newTable.positionX}
                    onChange={(e) => setNewTable({...newTable, positionX: parseFloat(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Posición Y</label>
                  <input
                    type="number"
                    value={newTable.positionY}
                    onChange={(e) => setNewTable({...newTable, positionY: parseFloat(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateTable}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Crear Mesa
              </button>
              <button
                onClick={() => setShowTableForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Nuevo Pedido</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mesa</label>
                <select
                  value={newOrder.tableId}
                  onChange={(e) => setNewOrder({...newOrder, tableId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Seleccionar mesa</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>Mesa {table.number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={newOrder.type}
                  onChange={(e) => setNewOrder({...newOrder, type: e.target.value as 'FOOD' | 'DRINK'})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="FOOD">Comida</option>
                  <option value="DRINK">Bebida</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Items</label>
                {newOrder.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={item.name}
                      onChange={(e) => updateOrderItem(index, 'name', e.target.value)}
                      className="flex-1 border rounded px-2 py-1"
                    />
                    <input
                      type="number"
                      placeholder="Precio"
                      value={item.price}
                      onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value))}
                      className="w-20 border rounded px-2 py-1"
                    />
                    <input
                      type="number"
                      placeholder="Cant"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                      className="w-16 border rounded px-2 py-1"
                    />
                  </div>
                ))}
                <button
                  onClick={addOrderItem}
                  className="text-blue-600 text-sm hover:underline"
                >
                  + Agregar item
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notas</label>
                <textarea
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreateOrder}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Crear Pedido
              </button>
              <button
                onClick={() => setShowOrderForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;