import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'stencilredux',
  outputTargets: [
    { type: 'dist' },
    { type: 'www', serviceWorker: null },
  ],
};
