/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { deepFreeze } from '@osd/std';
import { AuthenticationMethod } from './types';

export type IAuthenticationMethodRegistery = Omit<
  AuthenticationMethodRegistery,
  'registerAuthenticationMethod'
>;

export class AuthenticationMethodRegistery {
  private readonly authMethods = new Map<string, AuthenticationMethod>();

  /**
   * Register a {@link AuthenticationMethod} inside the registry.
   * Authentication Method can only be registered once. subsequent calls with the same method name will throw an error.
   */
  public registerAuthenticationMethod(authMethod: AuthenticationMethod) {
    if (this.authMethods.has(authMethod.authType)) {
      throw new Error(`Authentication method '${authMethod.authType}' is already registered`);
    }
    this.authMethods.set(authMethod.authType, deepFreeze(authMethod) as AuthenticationMethod);
  }

  public getAllAuthenticationMethods() {
    return [...this.authMethods.values()];
  }
}
