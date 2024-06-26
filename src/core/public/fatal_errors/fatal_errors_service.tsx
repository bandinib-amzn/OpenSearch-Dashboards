/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { render } from 'react-dom';
import * as Rx from 'rxjs';
import { first, tap } from 'rxjs/operators';

import { I18nStart } from '../i18n';
import { InjectedMetadataSetup } from '../injected_metadata';
import { FatalErrorsScreen } from './fatal_errors_screen';
import { FatalErrorInfo, getErrorInfo } from './get_error_info';

export interface Deps {
  i18n: I18nStart;
  injectedMetadata: InjectedMetadataSetup;
}

/**
 * FatalErrors stop the OpenSearch Dashboards Public Core and displays a fatal error screen
 * with details about the OpenSearch Dashboards build and the error.
 *
 * @public
 */
export interface FatalErrorsSetup {
  /**
   * Add a new fatal error. This will stop the OpenSearch Dashboards Public Core and display
   * a fatal error screen with details about the OpenSearch Dashboards build and the error.
   *
   * @param error - The error to display
   * @param source - Adds a prefix of the form `${source}: ` to the error message
   */
  add: (error: string | Error, source?: string) => never;

  /**
   * An Observable that will emit whenever a fatal error is added with `add()`
   */
  get$: () => Rx.Observable<FatalErrorInfo>;
}

/**
 * FatalErrors stop the OpenSearch Dashboards Public Core and displays a fatal error screen
 * with details about the OpenSearch Dashboards build and the error.
 *
 * @public
 */
export type FatalErrorsStart = FatalErrorsSetup;

/** @interal */
export class FatalErrorsService {
  private readonly errorInfo$ = new Rx.ReplaySubject<FatalErrorInfo>();
  private fatalErrors?: FatalErrorsSetup;

  /**
   *
   * @param rootDomElement
   * @param onFirstErrorCb - Callback function that gets executed after the first error,
   *   but before the FatalErrorsService renders the error to the DOM.
   */
  constructor(private rootDomElement: HTMLElement, private onFirstErrorCb: () => void) {}

  public setup({ i18n, injectedMetadata }: Deps) {
    this.errorInfo$
      .pipe(
        first(),
        tap(() => {
          this.onFirstErrorCb();
          this.renderError(injectedMetadata, i18n);
        })
      )
      .subscribe({
        error: (error) => {
          // eslint-disable-next-line no-console
          console.error('Uncaught error in fatal error service internals', error);
        },
      });

    this.fatalErrors = {
      add: (error, source?) => {
        const errorInfo = getErrorInfo(error, source);

        this.errorInfo$.next(errorInfo);

        if (error instanceof Error) {
          // make stack traces clickable by putting whole error in the console
          // eslint-disable-next-line no-console
          console.error(error);
        }

        throw error;
      },
      get$: () => {
        return this.errorInfo$.asObservable();
      },
    };

    this.setupGlobalErrorHandlers(this.fatalErrors!);

    return this.fatalErrors!;
  }

  public start() {
    const { fatalErrors } = this;
    if (!fatalErrors) {
      throw new Error('FatalErrorsService#setup() must be invoked before start.');
    }
    return fatalErrors;
  }

  private renderError(injectedMetadata: InjectedMetadataSetup, i18n: I18nStart) {
    // delete all content in the rootDomElement
    this.rootDomElement.textContent = '';

    // create and mount a container for the <FatalErrorScreen>
    const container = document.createElement('div');
    this.rootDomElement.appendChild(container);

    render(
      <i18n.Context>
        <FatalErrorsScreen
          buildNumber={injectedMetadata.getOpenSearchDashboardsBuildNumber()}
          opensearchDashboardsVersion={injectedMetadata.getOpenSearchDashboardsVersion()}
          errorInfo$={this.errorInfo$}
        />
      </i18n.Context>,
      container
    );
  }

  private setupGlobalErrorHandlers(fatalErrorsSetup: FatalErrorsSetup) {
    if (window.addEventListener) {
      window.addEventListener('unhandledrejection', function (e) {
        console.log(`Detected an unhandled Promise rejection.\n${e.reason}`); // eslint-disable-line no-console
      });
    }
  }
}
