import styles from './styles.module.css'

interface ActivateProps {
    prevFn: () => void
    redirectUrl: string
}

const Activate = ({ prevFn, redirectUrl }: ActivateProps) => {
    return (
        <div className={styles.container}>
            <a
                className={styles.activate_btn}
                href={redirectUrl}
                target='_top'
            >Activate</a>
            <button onClick={prevFn}>back</button>
        </div>
    )
}

export default Activate