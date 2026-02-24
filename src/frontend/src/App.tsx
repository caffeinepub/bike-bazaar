import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfileSetup from './components/ProfileSetup';
import ProfileCompletionBanner from './components/ProfileCompletionBanner';
import Home from './pages/Home';
import BikeListings from './pages/BikeListings';
import BikeDetail from './pages/BikeDetail';
import SellBike from './pages/SellBike';
import MyListings from './pages/MyListings';
import Messages from './pages/Messages';
import AboutUs from './pages/AboutUs';
import AdminPanel from './pages/AdminPanel';
import FounderLogin from './pages/FounderLogin';
import AdminLogin from './pages/AdminLogin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProfileCompletionBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ProfileSetup />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
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

const bikeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bike/$id',
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

const founderLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/founder-login',
  component: FounderLogin,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin-login',
  component: AdminLogin,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  listingsRoute,
  bikeDetailRoute,
  sellRoute,
  myListingsRoute,
  messagesRoute,
  aboutRoute,
  adminRoute,
  founderLoginRoute,
  adminLoginRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
