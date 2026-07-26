import React from 'react';
import { motion } from 'framer-motion';

export function LampContainer({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex min-h-[140px] flex-col items-center justify-center overflow-hidden bg-transparent w-full rounded-3xl z-0 ${className}`}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '28rem' }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-36 overflow-visible w-[28rem] bg-gradient-conic from-purple-600 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-itoura-surface h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-itoura-surface bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '28rem' }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-36 w-[28rem] bg-gradient-conic from-transparent via-transparent to-purple-600 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-[100%] right-0 bg-itoura-surface bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-itoura-surface h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        <div className="absolute top-1/2 h-32 w-full translate-y-12 scale-x-150 bg-itoura-surface blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-32 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-24 w-[24rem] -translate-y-6 rounded-full bg-purple-500 opacity-40 blur-3xl"></div>

        <motion.div
          initial={{ width: '8rem' }}
          whileInView={{ width: '16rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-12 rounded-full bg-purple-400 blur-2xl opacity-60"
        ></motion.div>

        <motion.div
          initial={{ width: '12rem' }}
          whileInView={{ width: '24rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="absolute inset-auto z-50 h-0.5 w-[24rem] -translate-y-10 bg-purple-400 shadow-[0_0_20px_5px_#A855F7]"
        ></motion.div>
      </div>

      <div className="relative z-50 flex flex-col items-center px-4 -mt-16">
        {children}
      </div>
    </div>
  );
}
