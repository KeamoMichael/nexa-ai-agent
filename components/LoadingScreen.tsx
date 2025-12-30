import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import nexaLogo from '../assets/Nexa-Star-PNG.png';

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
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#F9F9F9',
                        zIndex: 9999,
                    }}
                >
                    {/* Animated Logo */}
                    <motion.div
                        initial={{ scale: 0.3, opacity: 0, rotate: -180 }}
                        animate={{
                            scale: [0.3, 1.1, 1],
                            opacity: [0, 1, 1],
                            rotate: [180, 0, 0],
                        }}
                        transition={{
                            duration: 1.2,
                            times: [0, 0.6, 1],
                            ease: [0.34, 1.56, 0.64, 1], // Custom spring easing
                        }}
                        style={{
                            position: 'relative',
                        }}
                    >
                        {/* Logo image */}
                        <img
                            src={nexaLogo}
                            alt="Nexa AI"
                            style={{
                                width: '120px',
                                height: '120px',
                                objectFit: 'contain',
                            }}
                        />
                    </motion.div>

                    {/* Loading text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        style={{
                            marginTop: '40px',
                            textAlign: 'center',
                        }}
                    >
                        <motion.h2
                            style={{
                                fontFamily: "'EB Garamond', serif",
                                fontSize: '24px',
                                fontWeight: 500,
                                color: '#000000',
                                margin: '0 0 12px 0',
                                letterSpacing: '0.5px',
                            }}
                        >
                            Nexa AI
                        </motion.h2>

                        {/* Animated dots */}
                        <motion.div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                height: '24px',
                            }}
                        >
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={index}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.3, 1, 0.3],
                                    }}
                                    transition={{
                                        duration: 1.4,
                                        repeat: Infinity,
                                        delay: index * 0.2,
                                        ease: 'easeInOut',
                                    }}
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: '#888888',
                                    }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Bottom shimmer bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        style={{
                            position: 'absolute',
                            bottom: '80px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '200px',
                            height: '2px',
                            background: 'linear-gradient(90deg, transparent, #000000, transparent)',
                            overflow: 'hidden',
                        }}
                    >
                        <motion.div
                            animate={{
                                x: ['-200px', '400px'],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                            style={{
                                width: '100px',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.5), transparent)',
                            }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
