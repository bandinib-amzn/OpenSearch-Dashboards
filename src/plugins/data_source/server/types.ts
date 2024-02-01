/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LegacyCallAPIOptions,
  OpenSearchClient,
  SavedObjectsClientContract,
  OpenSearchDashboardsRequest,
} from 'src/core/server';
import {
  AuthType,
  DataSourceAttributes,
  SigV4Content,
  UsernamePasswordTypedContent,
} from '../common/data_sources';

import { CryptographyServiceSetup } from './cryptography_service';
import { DataSourceError } from './lib/error';
import { IAuthenticationMethodRegistery } from '../common/auth_registry';

export interface LegacyClientCallAPIParams {
  endpoint: string;
  clientParams?: Record<string, any>;
  options?: LegacyCallAPIOptions;
}

export interface DataSourceClientParams {
  // to fetch data source on behalf of users, caller should pass scoped saved objects client
  savedObjects: SavedObjectsClientContract;
  cryptography: CryptographyServiceSetup;
  // optional when creating test client, required for normal client
  dataSourceId?: string;
  // required when creating test client
  testClientDataSourceAttr?: DataSourceAttributes;
  request?: OpenSearchDashboardsRequest;
  authRegistryPromise?: Promise<IAuthenticationMethodRegistery>;
}

export interface DataSourceCredentialsProviderOptions {
  dataSourceAttr: DataSourceAttributes;
  request?: OpenSearchDashboardsRequest;
  cryptography?: CryptographyServiceSetup;
}

export type DataSourceCredentialsProvider = (
  options: DataSourceCredentialsProviderOptions
) => Promise<UsernamePasswordTypedContent | SigV4Content>;

export interface AuthMethodValues {
  credentialProvider: DataSourceCredentialsProvider;
  authType: AuthType;
}

export interface DataSourcePluginRequestContext {
  opensearch: {
    getClient: (dataSourceId: string) => Promise<OpenSearchClient>;
    legacy: {
      getClient: (
        dataSourceId: string
      ) => {
        callAPI: (
          endpoint: string,
          clientParams: Record<string, any>,
          options?: LegacyCallAPIOptions
        ) => Promise<unknown>;
      };
    };
  };
}
declare module 'src/core/server' {
  interface RequestHandlerContext {
    dataSource: DataSourcePluginRequestContext;
  }
}

export interface DataSourcePluginSetup {
  createDataSourceError: (err: any) => DataSourceError;

  registerCredentialProvider: (name: string, authMethodValues: AuthMethodValues) => void;
}

export interface DataSourcePluginStart {
  getAuthenticationMethodRegistery: () => IAuthenticationMethodRegistery;
}
