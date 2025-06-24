import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout/Layout.tsx'
import Home from './pages/Home/Home.tsx'
import Notification from './pages/Notification/Notification.tsx'
import rootLoader from './utils/loaders/rootLoader.ts'
import { BASE_PATH } from './config.ts'

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
], {
    basename: BASE_PATH
});

export default router;