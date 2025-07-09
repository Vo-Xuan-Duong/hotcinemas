import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home/Home';
import NotFound from './pages/ErrorPages/NotFound';

// Các trang sẽ tạo sau
const Login = React.lazy(() => import('./pages/Auth/Login'));
const Register = React.lazy(() => import('./pages/Auth/Register'));
const Profile = React.lazy(() => import('./pages/User/Profile'));
const BookingHistory = React.lazy(() => import('./pages/User/BookingHistory'));
const Movies = React.lazy(() => import('./pages/Movies/Movies'));
const MovieDetail = React.lazy(() => import('./pages/Movies/MovieDetail'));
const Cinemas = React.lazy(() => import('./pages/Cinemas/Cinemas'));
const CinemaDetail = React.lazy(() => import('./pages/Cinemas/CinemaDetail'));
const Booking = React.lazy(() => import('./pages/Booking/Booking'));
const BookingConfirm = React.lazy(() => import('./pages/Booking/BookingConfirm'));

// Admin pages
const AdminMovies = React.lazy(() => import('./pages/Admin/Movies'));
const AdminCinemas = React.lazy(() => import('./pages/Admin/Cinemas'));
const AdminSchedules = React.lazy(() => import('./pages/Admin/Schedules'));
const AdminUsers = React.lazy(() => import('./pages/Admin/Users'));
const AdminBookings = React.lazy(() => import('./pages/Admin/Bookings'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <React.Suspense fallback={<div>Loading...</div>}><Login /></React.Suspense> },
      { path: 'register', element: <React.Suspense fallback={<div>Loading...</div>}><Register /></React.Suspense> },
      { path: 'profile', element: <React.Suspense fallback={<div>Loading...</div>}><Profile /></React.Suspense> },
      { path: 'history', element: <React.Suspense fallback={<div>Loading...</div>}><BookingHistory /></React.Suspense> },
      { path: 'movies', element: <React.Suspense fallback={<div>Loading...</div>}><Movies /></React.Suspense> },
      { path: 'movies/:id', element: <React.Suspense fallback={<div>Loading...</div>}><MovieDetail /></React.Suspense> },
      { path: 'cinemas', element: <React.Suspense fallback={<div>Loading...</div>}><Cinemas /></React.Suspense> },
      { path: 'cinemas/:id', element: <React.Suspense fallback={<div>Loading...</div>}><CinemaDetail /></React.Suspense> },
      { path: 'booking', element: <React.Suspense fallback={<div>Loading...</div>}><Booking /></React.Suspense> },
      { path: 'booking/confirm', element: <React.Suspense fallback={<div>Loading...</div>}><BookingConfirm /></React.Suspense> },
    ],
    errorElement: <NotFound />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <React.Suspense fallback={<div>Loading...</div>}><AdminMovies /></React.Suspense> },
      { path: 'movies', element: <React.Suspense fallback={<div>Loading...</div>}><AdminMovies /></React.Suspense> },
      { path: 'cinemas', element: <React.Suspense fallback={<div>Loading...</div>}><AdminCinemas /></React.Suspense> },
      { path: 'schedules', element: <React.Suspense fallback={<div>Loading...</div>}><AdminSchedules /></React.Suspense> },
      { path: 'users', element: <React.Suspense fallback={<div>Loading...</div>}><AdminUsers /></React.Suspense> },
      { path: 'bookings', element: <React.Suspense fallback={<div>Loading...</div>}><AdminBookings /></React.Suspense> },
    ],
    errorElement: <NotFound />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter; 