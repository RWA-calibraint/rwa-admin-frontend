'use client';

import { useState, useEffect } from 'react';

export const useUsdToPolConverter = () => {
  const [pol, setPol] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const price = parseFloat(localStorage.getItem('usdToPol') as string);

    if (!isNaN(price)) {
      setPol(price);
    }
  }, [setPol]);

  useEffect(() => {
    async function getUSDToPOL() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=polygon-ecosystem-token&vs_currencies=usd`,
        );

        const data = await res.json();

        const price = data['polygon-ecosystem-token']?.usd;

        setPol(price);
        localStorage.setItem('usdToPol', price.toString());
      } catch (error) {}
    }

    getUSDToPOL();
  }, []);

  const convertUsdToPol = (usdAmount: number): number => {
    if (!pol || pol <= 0) return 0;

    return parseFloat((usdAmount / pol).toFixed(2));
  };

  return {
    pol,
    convertUsdToPol,
  };
};
