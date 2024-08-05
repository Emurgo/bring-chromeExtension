import styles from './styles.module.css'
import { sendMessage, ACTIONS } from '../../utils/sendMessage';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics';

interface Props {
    onClose: () => void;
    open: boolean
}

const options = [
    { label: '24 hours', time: 24 * 60 * 60 * 1000 },
    { label: '7 days', time: 7 * 24 * 60 * 60 * 1000 },
    { label: '30 days', time: 30 * 24 * 60 * 60 * 1000 },
    { label: 'forever', time: Infinity },
]

const OptOut = ({ open, onClose }: Props) => {
    const { sendGaEvent } = useGoogleAnalytics()
    const [isOpted, setIsOpted] = useState(false)
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleOptOut = (time: number, label: string) => {
        sendMessage({ action: ACTIONS.OPT_OUT, time })
        setIsOpted(true)
        sendGaEvent('opt_out', {
            category: 'user_action',
            action: 'click',
            details: label
        })
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
                        ref={popupRef}
                        transition={{ ease: 'easeInOut' }}
                        initial={{ y: '100px' }}
                        animate={{ y: '0' }}
                        exit={{ y: '100px' }}
                        className={styles.card}>
                        <div className={styles.title}>Turn off Cashback offers for</div>
                        {!isOpted ? <div className={styles.container}>
                            {options.map((option) => (
                                <button
                                    key={option.label}
                                    className={styles.btn}
                                    onClick={() => handleOptOut(option.time, option.label)}
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
                            Cancel
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