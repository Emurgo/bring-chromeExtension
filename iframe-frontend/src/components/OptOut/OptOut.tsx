import styles from './styles.module.css'
import { sendMessage, ACTIONS } from '../../utils/sendMessage';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptOutProps {
    onClose: () => void;
    open: boolean
}

const options = [
    { label: '24 hours', time: 24 * 60 * 60 * 1000 },
    { label: '7 days', time: 7 * 24 * 60 * 60 * 1000 },
    { label: '30 days', time: 30 * 24 * 60 * 60 * 1000 },
    { label: 'forever', time: Infinity },
]

const OptOut = ({ open, onClose }: OptOutProps) => {
    const [isOpted, setIsOpted] = useState(false)

    const handleOptOut = (time: number) => {
        sendMessage({ action: ACTIONS.OPT_OUT, time })
        setIsOpted(true)
    }

    return (
        <AnimatePresence>
            {open ?

                <motion.div
                    transition={{ ease: 'easeInOut' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.overlay}>
                    <motion.div
                        transition={{ ease: 'easeInOut' }}
                        initial={{ y: '100px' }}
                        animate={{ y: '0' }}
                        exit={{ y: '100px' }}
                        className={styles.card}>
                        {!isOpted ? <div className={styles.container}>
                            {options.map((option) => (
                                <button
                                    key={option.label}
                                    className={styles.btn}
                                    onClick={() => handleOptOut(option.time)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                            :
                            <div>Turned off</div>
                        }
                        <button
                            className={styles.close_btn}
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </motion.div >
                </motion.div>
                :
                null
            }
        </AnimatePresence>
    )
}

export default OptOut