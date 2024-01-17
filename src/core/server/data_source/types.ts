/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DataSourceServiceSetup {
  registerAuthenticationMethod: (authMethod: AuthenticationMethod) => void;
}

export type InternalDataSourceServiceSetup = DataSourceServiceSetup;

export interface AuthenticationMethod {
  name: string;
  description: string;
}
