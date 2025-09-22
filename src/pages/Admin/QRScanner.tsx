import React, { useState } from 'react';
import { QrCode, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { validateQRCode, checkInTicket } from '../../api/qr';

const QRScanner: React.FC = () => {
  const [qrInput, setQrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    ticket?: any;
  } | null>(null);

  const handleValidateQR = async () => {
    if (!qrInput.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const validation = await validateQRCode(qrInput);
      
      if (validation.valid) {
        setResult({
          type: 'success',
          message: validation.message,
          ticket: validation.ticket
        });
      } else {
        setResult({
          type: 'error',
          message: validation.message
        });
      }
    } catch (error: any) {
      setResult({
        type: 'error',
        message: error.response?.data?.message || 'Error al validar QR'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!qrInput.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const checkin = await checkInTicket(qrInput);
      
      if (checkin.success) {
        setResult({
          type: 'success',
          message: checkin.message,
          ticket: checkin.ticket
        });
        setQrInput('');
      } else {
        setResult({
          type: 'warning',
          message: checkin.message
        });
      }
    } catch (error: any) {
      setResult({
        type: 'error',
        message: error.response?.data?.message || 'Error al hacer check-in'
      });
    } finally {
      setLoading(false);
    }
  };

  const getResultIcon = () => {
    switch (result?.type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getResultBgColor = () => {
    switch (result?.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return '';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <QrCode className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Scanner QR</h1>
          <p className="text-gray-600">Escanea o ingresa el código QR del ticket</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código QR
              </label>
              <input
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="Ingresa o escanea el código QR"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                onKeyPress={(e) => e.key === 'Enter' && handleValidateQR()}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleValidateQR}
                disabled={loading || !qrInput.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Validando...' : 'Validar'}
              </button>
              <button
                onClick={handleCheckIn}
                disabled={loading || !qrInput.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Check-in'}
              </button>
            </div>
          </div>
        </div>

        {result && (
          <div className={`border rounded-lg p-4 ${getResultBgColor()}`}>
            <div className="flex items-start space-x-3">
              {getResultIcon()}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{result.message}</p>
                {result.ticket && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p><strong>Ticket ID:</strong> {result.ticket.id}</p>
                    <p><strong>Comprador:</strong> {result.ticket.buyerName} {result.ticket.buyerLastName}</p>
                    <p><strong>Email:</strong> {result.ticket.buyerEmail}</p>
                    <p><strong>Evento:</strong> {result.ticket.event?.title}</p>
                    <p><strong>Estado:</strong> {result.ticket.checkedIn ? 'Ya ingresó' : 'Pendiente'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Instrucciones:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Validar:</strong> Verifica si el QR es válido sin hacer check-in</li>
            <li>• <strong>Check-in:</strong> Marca el ticket como ingresado al evento</li>
            <li>• Los tickets solo pueden hacer check-in una vez</li>
            <li>• Presiona Enter después de ingresar el código para validar</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;