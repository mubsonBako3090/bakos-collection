import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'aos/dist/aos.css';
import '../styles/globals.css';
import { CartProvider } from '@/contexts/CartContext';

export const metadata = {
  title: "Bako's Collection - Nigeria E-Commerce",
  description: 'Fashion | Digital Assets | Physical Products in Nigeria',
};

export default function RootLayout({ children }) {
  return (
 <html lang="en">
  <body>
        <CartProvider>{children}</CartProvider>
      </body>
 </html>
 );
}