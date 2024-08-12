interface Props {
    platformName: string
    width?: number
    height?: number
    size?: 'sm' | 'md'
}

const PlatformLogo = ({ platformName, size = 'md', width = 108, height }: Props) => {
    return (
        <img
            src={`/images/logos/${platformName}_${size}.svg`}
            alt="platform logo"
            width={width}
            height={height}
        />
    )
}

export default PlatformLogo