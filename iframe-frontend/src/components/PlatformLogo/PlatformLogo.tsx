interface Props {
    platformName: string
    width?: number
    height?: number
}

const PlatformLogo = ({ platformName, width = 108, height }: Props) => {
    return (
        <img
            src={`/images/logos/${platformName}.svg`}
            alt="platform logo"
            width={width}
            height={height}
        />
    )
}

export default PlatformLogo