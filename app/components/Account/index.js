import React from 'react';

import CheckPrivateFlash from './CheckPrivateFlash';
import CheckPublicFlash from './CheckPublicFlash';
import GeneratePrivate from './GeneratePrivate';
import GeneratePublic from './GeneratePublic';
import Final from './Final';
import ShowPassphrase from './ShowPassphrase';
import StepHandler from '../StepHandler';

const steps = [
  CheckPrivateFlash,
  GeneratePrivate,
  ShowPassphrase,
  CheckPublicFlash,
  GeneratePublic,
  Final,
];

const Account = props => <StepHandler {...props} steps={steps} />;

export default Account;
