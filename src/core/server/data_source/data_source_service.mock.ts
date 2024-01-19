/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataSourceServiceSetup, DataSourceServiceStart } from './types';

const createSetupContractMock = () => {
  const setupContract: jest.Mocked<DataSourceServiceSetup> = {
    registerAuthenticationMethod: jest.fn(),
  };
  return setupContract;
};

const createStartContractMock = () => {
  const startContract: jest.Mocked<DataSourceServiceStart> = {
    getAuthenticationMethodRegistery: jest.fn(),
  };
  return startContract;
};

export const dataSourceServiceMock = {
  createSetupContract: createSetupContractMock,
  createStartContarct: createStartContractMock,
};
