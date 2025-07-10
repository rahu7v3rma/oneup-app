import { JSX } from 'react';

export type LinkedAccount = {
  id: string;
  type: 'Mastercard' | 'Paypal' | 'Bank';
  navigate: 'CardDetails';
  name: string;
  icon: JSX.Element;
  cardNumber: string;
  cardFee: string;
  cardExpiry: string;
};
