/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { LegacyCallAPIOptions, OpenSearchClient } from 'src/core/server';
import { IAuthenticationMethodRegistery } from './authentication_methods_registry';
export interface DataSourceServiceSetup {
  registerAuthenticationMethod: (authMethod: AuthenticationMethod) => void;
}

export type InternalDataSourceServiceSetup = DataSourceServiceSetup;

export interface DataSourceServiceStart {
  getAuthenticationMethodRegistery: () => IAuthenticationMethodRegistery;
}

export type InternalDataSourceServiceStart = DataSourceServiceStart;

export interface AuthenticationMethod {
  // authType should be unique
  authType: string;
  getClient?: () => Promise<OpenSearchClient>;
  getLegacyClient?: () => {
    callAPI: (
      endpoint: string,
      clientParams?: Record<string, any>,
      options?: LegacyCallAPIOptions
    ) => Promise<unknown>;
  };
}
