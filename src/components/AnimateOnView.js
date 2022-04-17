import React from 'react';
import {motion} from 'framer-motion'

function FadeInWhenVisible({ children }) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ 
            duration: 0.5,
            staggerChildren: 4,
            type: 'spring',
            stiffness: 100,
            damping: 20,
            delayChildren: 0.5,
            delay: 0.5,

            }}
        variants={{
          visible: { opacity: 1, y: -20, scale: 1 },
          hidden: { opacity: 0, y: 0 , scale: 0.5 },
        }}
      >
        {children}
      </motion.div>
    );
  }

  export default FadeInWhenVisible;