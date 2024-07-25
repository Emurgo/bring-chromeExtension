interface Props {
    platformName: string
    width?: number
    height?: number
}

const PlatformLogo = ({ platformName, width = 160, height }: Props) => {
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