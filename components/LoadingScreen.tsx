import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import nexaStar from '../assets/Nexa-Star-PNG.png';
import nexaText from '../assets/Nexa Text.png';

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
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        {/* Logo Star - Scale up, rotate, settle, then slide left */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{
                                scale: [0, 1.3, 1, 1],
                                rotate: [-180, 0, 0, 0],
                                x: [0, 0, 0, -20], // Slide left 20px
                            }}
                            transition={{
                                duration: 2.2,
                                times: [0, 0.4, 0.6, 1],
                                ease: [[0.34, 1.56, 0.64, 1], 'easeOut', 'easeOut', [0.5, 0, 0.1, 1]], // Spring easing, then smooth slide
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
                                    width: '80px',
                                    height: '80px',
                                    objectFit: 'contain',
                                }}
                            />
                        </motion.div>

                        {/* Text - Slides in from right and fades in */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{
                                opacity: [0, 0, 0, 1],
                                x: [-30, -30, -30, 0],
                            }}
                            transition={{
                                duration: 2.2,
                                times: [0, 0.6, 0.7, 1],
                                ease: 'easeOut',
                            }}
                            style={{
                                position: 'relative',
                                marginLeft: '12px',
                            }}
                        >
                            <img
                                src={nexaText}
                                alt="Nexa"
                                style={{
                                    height: '32px',
                                    width: 'auto',
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
