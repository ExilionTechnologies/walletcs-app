import React from 'react';

import CheckPrivateFlash from '../Account/CheckPrivateFlash';
import SelectTransaction from './SelectTransaction';
import StepHandler from '../StepHandler';
import CheckTransactionFlash from './CheckTransactionFlash';
import DetectPrivateKeys from './DetectPrivateKeys';
import SelectTransactionsForSign from './SelectTransactionsForSign';
import Final from './Final';

const steps = [
  CheckTransactionFlash,
  SelectTransaction,
  CheckPrivateFlash,
  DetectPrivateKeys,
  CheckTransactionFlash,
  SelectTransactionsForSign,
  Final
]

const SignTransaction = props => (
  <StepHandler {...props} steps={steps} onlyPrivate />
);

export default SignTransaction;
