import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import AdminLayoutAntd from './layouts/AdminLayoutAntd';
import HomeModern from './pages/User/Home/HomeModern';
import NotFound from './pages/Common/ErrorPages/NotFound';
import PageTransition from './components/Loading/PageTransition';

// Auth pages
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));

// User pages - Ant Design versions
const ProfileModern = React.lazy(() => import('./pages/User/Profile/ProfileModern'));
const BookingHistoryAntd = React.lazy(() => import('./pages/User/BookingHistory/BookingHistoryAntd'));
const MoviesModern = React.lazy(() => import('./pages/User/Movies/MoviesModern'));
const MovieDetailModern = React.lazy(() => import('./pages/User/Movies/MovieDetailModern'));
const MovieDetailImage = React.lazy(() => import('./pages/User/Movies/MovieDetailImage'));
const CinemasModern = React.lazy(() => import('./pages/User/Cinemas/CinemasModern'));
const CinemasNew = React.lazy(() => import('./pages/User/Cinemas/CinemasNew'));
const CinemaDetail = React.lazy(() => import('./pages/User/Cinemas/CinemaDetail'));
const CinemaSchedule = React.lazy(() => import('./pages/User/Cinemas/CinemaSchedule'));
const ScheduleModern = React.lazy(() => import('./pages/User/Schedule/ScheduleModern'));
const ScheduleModernNew = React.lazy(() => import('./pages/User/Schedule/ScheduleModernNew'));
const Booking = React.lazy(() => import('./pages/User/Booking'));
const BookingConfirm = React.lazy(() => import('./pages/User/Booking/BookingConfirm'));
const SearchResults = React.lazy(() => import('./pages/User/Search/SearchResults'));
const Notifications = React.lazy(() => import('./pages/User/Notifications/Notifications'));
const Cart = React.lazy(() => import('./pages/User/Cart/Cart'));

// Admin pages
const Dashboard = React.lazy(() => import('./pages/Admin/Dashboard'));
const AdminMovies = React.lazy(() => import('./pages/Admin/Movies'));
const AdminMovieDetail = React.lazy(() => import('./pages/Admin/Movies/MovieDetail'));
const AdminCinemas = React.lazy(() => import('./pages/Admin/Cinemas'));
const AdminCinemaDetail = React.lazy(() => import('./pages/Admin/Cinemas/CinemaDetail'));
const AdminComments = React.lazy(() => import('./pages/Admin/Comments'));
const AdminSchedules = React.lazy(() => import('./pages/Admin/Schedules'));
const AdminUsers = React.lazy(() => import('./pages/Admin/Users'));
const AdminBookings = React.lazy(() => import('./pages/Admin/Bookings'));
const AdminSeats = React.lazy(() => import('./pages/Admin/Seats'));
const AdminReports = React.lazy(() => import('./pages/Admin/Reports'));
const AdminPromotions = React.lazy(() => import('./pages/Admin/Promotions'));
const AdminSettings = React.lazy(() => import('./pages/Admin/Settings'));

// New Admin pages
const AdminNotifications = React.lazy(() => import('./pages/Admin/Notifications'));
const AdminStaff = React.lazy(() => import('./pages/Admin/Staff'));
const AdminFoodBeverage = React.lazy(() => import('./pages/Admin/FoodBeverage'));
const AdminPayment = React.lazy(() => import('./pages/Admin/Payment'));
const AdminTesting = React.lazy(() => import('./pages/Admin/Testing'));

// Demo pages - Cleaned up unused imports
// const SwiperDemo = React.lazy(() => import('./pages/SwiperDemo'));
// const AuthTest = React.lazy(() => import('./components/AuthTest')); 
const MovieLinkTest = React.lazy(() => import('./pages/User/Movies/MovieLinkTest'));
// const TestUsers = React.lazy(() => import('./TestUsers'));
// const LoginDemo = React.lazy(() => import('./pages/LoginDemo'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { index: true, element: <HomeModern /> },
      { path: 'login', element: <React.Suspense fallback={<PageTransition type="modern" message="Đang tải trang đăng nhập..." />}><Login /></React.Suspense> },
      { path: 'register', element: <React.Suspense fallback={<PageTransition type="modern" message="Đang tải trang đăng ký..." />}><Register /></React.Suspense> },
      { path: 'profile', element: <React.Suspense fallback={<PageTransition type="modern" message="Đang tải hồ sơ cá nhân..." />}><ProfileModern /></React.Suspense> },
      { path: 'history', element: <React.Suspense fallback={<PageTransition type="ticket" message="Đang tải lịch sử đặt vé..." />}><BookingHistoryAntd /></React.Suspense> },
      { path: 'movies', element: <React.Suspense fallback={<PageTransition type="movie" message="Đang tải danh sách phim..." />}><MoviesModern /></React.Suspense> },
      { path: 'movies/:id', element: <React.Suspense fallback={<PageTransition type="movie" message="Đang tải thông tin phim..." />}><MovieDetailImage /></React.Suspense> },
      // Alias for singular form (in case user navigates to /movie/:id leading to 404)
      { path: 'movie/:id', element: <React.Suspense fallback={<PageTransition type="movie" message="Đang tải thông tin phim..." />}><MovieDetailImage /></React.Suspense> },
      { path: 'cinemas', element: <React.Suspense fallback={<PageTransition type="cinema" message="Đang tải danh sách rạp..." />}><CinemasNew /></React.Suspense> },
      { path: 'cinemas/:id', element: <React.Suspense fallback={<PageTransition type="cinema" message="Đang tải thông tin rạp..." />}><CinemaDetail /></React.Suspense> },
      { path: 'cinemas/:cinemaId/schedule', element: <React.Suspense fallback={<PageTransition type="cinema" message="Đang tải lịch chiếu rạp..." />}><CinemaSchedule /></React.Suspense> },
      { path: 'schedule', element: <React.Suspense fallback={<PageTransition type="cinema" message="Đang tải lịch chiếu..." />}><ScheduleModernNew /></React.Suspense> },
      { path: 'search', element: <React.Suspense fallback={<PageTransition type="modern" message="Đang tìm kiếm..." />}><SearchResults /></React.Suspense> },
      { path: 'notifications', element: <React.Suspense fallback={<PageTransition type="modern" message="Đang tải thông báo..." />}><Notifications /></React.Suspense> },
      { path: 'cart', element: <React.Suspense fallback={<PageTransition type="ticket" message="Đang tải giỏ hàng..." />}><Cart /></React.Suspense> },
      { path: 'booking', element: <React.Suspense fallback={<PageTransition type="ticket" message="Đang tải trang đặt vé..." />}><Booking /></React.Suspense> },
      { path: 'booking/confirm', element: <React.Suspense fallback={<PageTransition type="ticket" message="Đang xác nhận đặt vé..." />}><BookingConfirm /></React.Suspense> },
      // Removed unused demo/test routes
      // { path: 'swiper-demo', element: <React.Suspense fallback={<PageTransition type="modern" message="Đang tải demo..." />}><SwiperDemo /></React.Suspense> },
      // { path: 'auth-test', element: <React.Suspense fallback={<PageTransition type="modern" message="Đang tải test..." />}><AuthTest /></React.Suspense> },
      { path: 'movie-link-test', element: <React.Suspense fallback={<PageTransition type="movie" message="Đang tải test..." />}><MovieLinkTest /></React.Suspense> },
      // { path: 'test-users', element: <React.Suspense fallback={<PageTransition type="modern" message="Đang tải test..." />}><TestUsers /></React.Suspense> },
      // { path: 'login-demo', element: <React.Suspense fallback={<PageTransition type="modern" message="Đang tải demo..." />}><LoginDemo /></React.Suspense> },
    ],
    errorElement: <NotFound />,
  },
  // Admin redirect routes for shorter URLs
  {
    path: '/dashboard',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  // Commented out to avoid conflict with user movies routes
  /*
  {
    path: '/movies',
    element: <Navigate to="/admin/movies" replace />,
  },
  */
  {
    path: '/users',
    element: <Navigate to="/admin/users" replace />,
  },
  {
    path: '/cinemas',
    element: <Navigate to="/admin/cinemas" replace />,
  },
  {
    path: '/bookings',
    element: <Navigate to="/admin/bookings" replace />,
  },
  {
    path: '/settings',
    element: <Navigate to="/admin/settings" replace />,
  },
  {
    path: '/promotions',
    element: <Navigate to="/admin/promotions" replace />,
  },
  {
    path: '/reports',
    element: <Navigate to="/admin/reports" replace />,
  },
  {
    path: '/seats',
    element: <Navigate to="/admin/seats" replace />,
  },
  {
    path: '/admin',
    element: <AdminLayoutAntd />,
    children: [
      { index: true, element: <React.Suspense fallback={<PageTransition type="modern" message="Đang tải dashboard..." />}><Dashboard /></React.Suspense> },
      { path: 'dashboard', element: <React.Suspense fallback={<PageTransition type="modern" message="Đang tải dashboard..." />}><Dashboard /></React.Suspense> },
      { path: 'movies', element: <React.Suspense fallback={<div>Loading...</div>}><AdminMovies /></React.Suspense> },
      { path: 'movies/:id', element: <React.Suspense fallback={<div>Loading...</div>}><AdminMovieDetail /></React.Suspense> },
      { path: 'cinemas', element: <React.Suspense fallback={<div>Loading...</div>}><AdminCinemas /></React.Suspense> },
      { path: 'cinemas/:id', element: <React.Suspense fallback={<div>Loading...</div>}><AdminCinemaDetail /></React.Suspense> },
      { path: 'cinemas/detail/:id', element: <React.Suspense fallback={<div>Loading...</div>}><AdminCinemaDetail /></React.Suspense> },
      { path: 'comments', element: <React.Suspense fallback={<div>Loading...</div>}><AdminComments /></React.Suspense> },
      { path: 'schedules', element: <React.Suspense fallback={<div>Loading...</div>}><AdminSchedules /></React.Suspense> },
      { path: 'users', element: <React.Suspense fallback={<div>Loading...</div>}><AdminUsers /></React.Suspense> },
      { path: 'bookings', element: <React.Suspense fallback={<div>Loading...</div>}><AdminBookings /></React.Suspense> },
      { path: 'seats', element: <React.Suspense fallback={<div>Loading...</div>}><AdminSeats /></React.Suspense> },
      { path: 'reports', element: <React.Suspense fallback={<div>Loading...</div>}><AdminReports /></React.Suspense> },
      { path: 'promotions', element: <React.Suspense fallback={<div>Loading...</div>}><AdminPromotions /></React.Suspense> },
      { path: 'settings', element: <React.Suspense fallback={<div>Loading...</div>}><AdminSettings /></React.Suspense> },
      // New Admin routes
      { path: 'notifications', element: <React.Suspense fallback={<div>Loading...</div>}><AdminNotifications /></React.Suspense> },
      { path: 'staff', element: <React.Suspense fallback={<div>Loading...</div>}><AdminStaff /></React.Suspense> },
      { path: 'food-beverage', element: <React.Suspense fallback={<div>Loading...</div>}><AdminFoodBeverage /></React.Suspense> },
      { path: 'payment', element: <React.Suspense fallback={<div>Loading...</div>}><AdminPayment /></React.Suspense> },
      { path: 'testing', element: <React.Suspense fallback={<div>Loading...</div>}><AdminTesting /></React.Suspense> },
    ],
    errorElement: <NotFound />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter; 