import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout/Layout.tsx'
import Home from './pages/Home/Home.tsx'
import Notification from './pages/Notification/Notification.tsx'
import rootLoader from './utils/loaders/rootLoader.ts'

const router = createBrowserRouter([
    {
        element: <Layout />,
        loader: rootLoader,
        id: "root",
        errorElement: <></>,
        shouldRevalidate: () => false,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/notification',
                element: <Notification />
            }
        ],
    },
]);

export default router;