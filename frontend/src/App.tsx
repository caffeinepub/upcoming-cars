import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  Link,
  useRouterState,
} from '@tanstack/react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CarDetailPage } from './pages/CarDetailPage';
import { CarsSearchPage } from './pages/CarsSearchPage';
import { NewsListingPage } from './pages/NewsListingPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { AdminPanel } from './pages/AdminPanel';

function Layout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-heading text-6xl font-bold text-auto-red mb-4">404</h1>
      <p className="font-heading text-2xl uppercase tracking-wide mb-2">Page Not Found</p>
      <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-auto-primary">Go Home</Link>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: NotFound,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const carsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cars',
  component: CarsSearchPage,
});

const carDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cars/$carId',
  component: CarDetailPage,
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news',
  component: NewsListingPage,
});

const newsDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news/$articleId',
  component: NewsDetailPage,
});

const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compare',
  component: ComparisonPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  carsRoute,
  carDetailRoute,
  newsRoute,
  newsDetailRoute,
  compareRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
