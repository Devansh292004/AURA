'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function CountUp({ value }: { value: number | string }) {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) || 0 : value;
  const spring = useSpring(0, { mass: 1, stiffness: 100, damping: 30 });
  const displayValue = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  return <motion.span>{displayValue}</motion.span>;
}
