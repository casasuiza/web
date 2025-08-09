import { MapPin, Mail, Facebook, Instagram, Twitter, PhoneForwarded } from 'lucide-react';
import fotoCasaSuiza from '../../../assets/logoCasaSuiza.png';
import Subscriber from './Subscriber';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: 'https://instagram.com/casasuizalp', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/casasuizalp', label: 'Instagram' },
    { icon: Twitter, href: 'https://instagram.com/casasuizalp', label: 'Twitter' },
    { icon: PhoneForwarded, href: '', label: 'Whatsapp' },
    { icon: Mail, href: '', label: 'Mail' }
  ];

  return (
    <footer id="contacto" className="bg-custom-red text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={fotoCasaSuiza}
                alt="Casa Suiza"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-white/90 text-sm max-w-md">
              Sala de conciertos y eventos
            </p>
            <p className="text-white/90 text-sm mb-6 max-w-md">
              Musica - Gastronomía - Bebidas - Amigos
            </p>
            {/* Social Media */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-white/80" />
                <div>
                  <p className="text-sm text-white/90">Calle 2 N° 621 e/ 44 y 45</p>
                  <p className="text-sm text-white/90">La Plata, Buenos Aires</p>
                </div>
              </div>
              <iframe
                className="rounded-lg border-4 border-gray-900 hover:border-yellow-500 transition-colors duration-300"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d204.49980255571754!2d-57.949954569339724!3d-34.90652878896529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a2e6462c654913%3A0x198205b6aa07b9f5!2sHelvecia%20Sociedad%20Suiza%20de%20S.M.%20La%20Plata!5e0!3m2!1ses!2sar!4v1751594996917!5m2!1ses!2sar"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriber Section */}
      <Subscriber />

      {/* Bottom Bar */}
      <div className="bg-red-800 border-t border-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-white/80">
            <p>© {currentYear} Casa Suiza | Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  );
}