/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoreService } from '../../types';
import { InternalDataSourceServiceSetup, AuthenticationMethod } from './types';
import { Logger } from '../logging';
import { CoreContext } from '../core_context';

export class DataSourceService implements CoreService<InternalDataSourceServiceSetup> {
  private logger: Logger;
  private started = false;

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
        this.logger.info(
          `authentication method received from plugin >>> name: ${authMethod.name} and description: ${authMethod.description}`
        );
      },
    };
  }

  public start() {
    this.logger.debug('Starting data source service');
    this.started = true;
  }

  public stop() {
    this.logger.debug('Stopping data source service');
  }
}
