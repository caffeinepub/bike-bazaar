import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import BikeListings from './pages/BikeListings';
import BikeDetail from './pages/BikeDetail';
import SellBike from './pages/SellBike';
import MyListings from './pages/MyListings';
import Messages from './pages/Messages';
import AboutUs from './pages/AboutUs';
import AdminPanel from './pages/AdminPanel';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const listingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listings',
  component: BikeListings,
});

const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listings/$id',
  component: BikeDetail,
});

const sellRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sell',
  component: SellBike,
});

const myListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-listings',
  component: MyListings,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages/$listingId',
  component: Messages,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutUs,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanel,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  listingsRoute,
  listingDetailRoute,
  sellRoute,
  myListingsRoute,
  messagesRoute,
  aboutRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
