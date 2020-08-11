import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'stencilredux',
  outputTargets: [{ type: 'dist' }],
  globalScript: 'src/global/store.ts',
};
