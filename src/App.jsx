import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Nav from './nav/Nav';
import Footer from './footer/Footer';
import FloatingContactButtons from './components/FloatingContactButtons';
import { usePageTracking } from './hooks/usePageTracking';
import { routes } from './config/routes';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Track page views for analytics
  usePageTracking();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <>    
      {!isAdminPage && <Nav />}
      <main className="page-content w-full ">
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <FloatingContactButtons />}
    </>
  );
}

export default App;
