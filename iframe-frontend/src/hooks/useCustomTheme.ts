import { useEffect, useState } from "react"
import { useSearchParams } from "./useSearchParams"

const getThemeParams = (params: Record<string, string>) => {
    const theme: Record<string, string> = {}
    Object.entries(params).map(([key, value]) => {
        if (key.startsWith('theme_')) theme[key.replace('theme_', '')] = value
    })
    return theme
}

interface ThemeParamsResult {
    done: boolean
}

const useCustomTheme = (): ThemeParamsResult => {
    const { getAllParams } = useSearchParams()
    const theme = getThemeParams(getAllParams())
    const [done, setDone] = useState(false)

    useEffect(() => {
        // Apply custom theme
        Object.entries(theme).map(([key, value]) => {
            document.documentElement.style.setProperty(`--${key}`, value)
        })
        setDone(true)
    }, [])

    return { done }
}

export default useCustomTheme