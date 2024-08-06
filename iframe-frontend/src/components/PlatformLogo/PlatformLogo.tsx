interface Props {
    platformName: string
    width?: number
    height?: number
}

const PlatformLogo = ({ width = 140, height }: Props) => {
    return (
        <img
            src={`/images/logos/GERO.svg`}
            // src={`/images/logos/${platformName}.svg`}
            alt="platform logo"
            width={width}
            height={height}
        />
    )
}

export default PlatformLogo