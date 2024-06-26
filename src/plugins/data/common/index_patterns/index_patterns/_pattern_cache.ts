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

import { IndexPattern } from './index_pattern';

export interface PatternCache {
  get: (id: string) => IndexPattern;
  getByTitle: (title: string) => IndexPattern;
  set: (id: string, value: IndexPattern) => IndexPattern;
  clear: (id: string) => void;
  clearAll: () => void;
}

export function createIndexPatternCache(): PatternCache {
  const vals: Record<string, any> = {};
  const cache: PatternCache = {
    get: (id: string) => {
      return vals[id];
    },
    getByTitle: (title: string) => {
      return Object.values(vals).find((pattern: IndexPattern) => pattern.title === title);
    },
    set: (id: string, prom: any) => {
      vals[id] = prom;
      return prom;
    },
    clear: (id: string) => {
      delete vals[id];
    },
    clearAll: () => {
      for (const id in vals) {
        if (vals.hasOwnProperty(id)) {
          delete vals[id];
        }
      }
    },
  };
  return cache;
}
