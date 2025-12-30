import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import nexaStar from '../assets/Nexa-Star-PNG.png';

interface LoadingScreenProps {
    isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#F9F9F9',
                        zIndex: 9999,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {/* Logo Star - Scale up from 0, rotate 360, smooth easing stop */}
                        <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{
                                scale: 1,
                                rotate: 360,
                            }}
                            transition={{
                                duration: 1.8,
                                ease: [0.22, 1, 0.36, 1], // Smooth slow easing stop (cubic-bezier)
                            }}
                            style={{
                                position: 'relative',
                                zIndex: 2,
                            }}
                        >
                            <img
                                src={nexaStar}
                                alt="Nexa"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'contain',
                                }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
