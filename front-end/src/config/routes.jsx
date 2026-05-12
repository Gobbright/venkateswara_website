import Home from '../home/Home';
import Mens from '../mens/Mens';
import Accessories from '../accessories/Accessories';
import Womens from '../womens/Womens';
import Kids from '../kids/Kids';
import About from '../other/about/About';
import Tailoring from '../other/tailoring/Tailoring';
import Contact from '../other/contact/Contact';
import FestiveWear from '../festive/FestiveWear';
import Order from '../order/Order';
import Cart from '../other/cart/Cart';
import Wishlist from '../other/wishlist/Wishlist';
import Product from '../product-details/Product';
import VideoCall from '../other/video-call/VideoCall';
import Auth from '../other/auth/Auth';
import CategoriesPage from '../categories/CategoriesPage';
import Admin from '../Admin/Admin';

export const routes = [
  { path: '/', element: <Home />, name: 'Home' },
  { path: '/home', element: <Home />, name: 'Home' },
  { path: '/mens', element: <Mens />, name: 'Mens' },
  { path: '/accessories', element: <Accessories />, name: 'Accessories' },
  { path: '/womens', element: <Womens />, name: 'Womens' },
  { path: '/kids', element: <Kids />, name: 'Kids' },
  { path: '/categories', element: <CategoriesPage />, name: 'All Categories' },
  { path: '/festive-wear', element: <FestiveWear />, name: 'Festive Wear' },
  { path: '/product/:id', element: <Product />, name: 'Product Details' },
  { path: '/cart', element: <Cart />, name: 'Cart' },
  { path: '/wishlist', element: <Wishlist />, name: 'Wishlist' },
  { path: '/video-call', element: <VideoCall />, name: 'Video Call' },
  { path: '/login', element: <Auth />, name: 'Login' },
  { path: '/order', element: <Order />, name: 'Order' },
  { path: '/order/track', element: <Order />, name: 'Track Order' },
  { path: '/other/about', element: <About />, name: 'About' },
  { path: '/other/contact', element: <Contact />, name: 'Contact' },
  { path: '/other/tailoring', element: <Tailoring />, name: 'Tailoring' },
  { path: '/admin/*', element: <Admin />, name: 'Admin' },
];
