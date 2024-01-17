/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataSourceServiceSetup } from './types';

const createSetupContractMock = () => {
  const setupContract: jest.Mocked<DataSourceServiceSetup> = {
    registerAuthenticationMethod: jest.fn(),
  };
  return setupContract;
};

export const dataSourceServiceMock = {
  createSetupContract: createSetupContractMock,
};
