/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoreService } from '../../types';
import {
  InternalDataSourceServiceSetup,
  AuthenticationMethod,
  InternalDataSourceServiceStart,
} from './types';
import { Logger } from '../logging';
import { CoreContext } from '../core_context';
import { AuthenticationMethodRegistery } from './authentication_methods_registry';

export class DataSourceService
  implements CoreService<InternalDataSourceServiceSetup, InternalDataSourceServiceStart> {
  private logger: Logger;
  private started = false;
  private authMethodsRegistry = new AuthenticationMethodRegistery();

  constructor(coreContext: CoreContext) {
    this.logger = coreContext.logger.get('data-source-service');
  }

  public setup() {
    this.logger.debug('Setting up data source service');
    return {
      registerAuthenticationMethod: (authMethod: AuthenticationMethod) => {
        if (this.started) {
          throw new Error('cannot call `registerAuthenticationMethod` after service startup.');
        }
        this.authMethodsRegistry.registerAuthenticationMethod(authMethod);
      },
    };
  }

  public async start(): Promise<InternalDataSourceServiceStart> {
    this.logger.debug('Starting data source service');
    this.started = true;
    return {
      getAuthenticationMethodRegistery: () => this.authMethodsRegistry,
    };
  }

  public stop() {
    this.logger.debug('Stopping data source service');
  }
}
