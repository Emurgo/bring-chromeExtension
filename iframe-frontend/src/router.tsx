import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout/Layout.tsx'
import Home from './pages/Home/Home.tsx'
import Notification from './pages/Notification/Notification.tsx'
import verify from './api/verify.ts'
import { sendMessage, ACTIONS } from './utils/sendMessage.ts'
import { keyFrames } from './utils/iframeStyles.ts'

const rootLoader = async ({ request }: { request: Request }) => {
    sendMessage({ action: ACTIONS.ADD_KEYFRAMES, keyFrames })
    const searchParams = new URL(request.url).searchParams
    const res = await verify(searchParams.get('token'))
    if (res.status !== 200) throw `got ${res.status} code`
    return res.info
}

const router = createBrowserRouter([
    {
        element: <Layout />,
        loader: rootLoader,
        id: "root",
        errorElement: <></>,
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