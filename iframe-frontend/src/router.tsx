import { createBrowserRouter } from 'react-router-dom'
import Layout from './Layout/Layout.tsx'
import Home from './pages/Home/Home.tsx'
import Notification from './pages/Notification/Notification.tsx'
import verify from './api/verify.ts'
import { sendMessage, ACTIONS } from './utils/sendMessage.ts'
import { keyFrames } from './utils/iframeStyles.ts'
import loadFont from './utils/loadFont.ts'

const rootLoader = async ({ request }: { request: Request }) => {
    sendMessage({ action: ACTIONS.ADD_KEYFRAMES, keyFrames })
    const searchParams = new URL(request.url).searchParams
    const textMode = searchParams.get('textMode') || 'lower'
    console.log({ textMode });

    const themeMode = searchParams.get('themeMode') || 'light'
    loadFont(searchParams.get('t_fontUrl'), searchParams.get('t_fontFamily'))
    const res = await verify(searchParams.get('token'))
    if (res.status !== 200) throw `got ${res.status} code`
    return {
        ...res.info,
        iconsPath: `/${themeMode}/icons/${res.info.platformName.toUpperCase() || 'DEFAULT'}`,
        themeMode,
        textMode
    }
}

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