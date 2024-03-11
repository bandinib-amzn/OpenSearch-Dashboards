/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { schema, Type } from '@osd/config-schema';
import { IRouter, OpenSearchClient } from 'opensearch-dashboards/server';
import { AuthType, DataSourceAttributes, SigV4ServiceName } from '../../common/data_sources';
import { DataSourceConnectionValidator } from './data_source_connection_validator';
import { DataSourceServiceSetup } from '../data_source_service';
import { CryptographyServiceSetup } from '../cryptography_service';
import { IAuthenticationMethodRegistery } from '../auth_registry';
import { CustomApiSchemaRegistry } from '../schema_registry/custom_api_schema_registry';

export const registerTestConnectionRoute = async (
  router: IRouter,
  dataSourceServiceSetup: DataSourceServiceSetup,
  cryptography: CryptographyServiceSetup,
  authRegistryPromise: Promise<IAuthenticationMethodRegistery>,
  customApiSchemaRegistryPromise: Promise<CustomApiSchemaRegistry>
) => {
  const authRegistry = await authRegistryPromise;
  // const authmethods: string[] = [AuthType.NoAuth]; //['type_A', 'type_B'];
  // const authmethods2 = [
  //   // 'type_A',
  //   // 'type_B',
  //   // '',
  //   AuthType.NoAuth,
  //   AuthType.UsernamePasswordType,
  //   AuthType.SigV4,
  // ];
  // // const serviceSchemas = schema.union([authmethods.map((auth) => schema.literal(auth))]);
  // const testSchema = schema.oneOf(
  //   authmethods.map((authmethod) => schema.literal(authmethod)) as [Type<string>]
  // );
  // const testSchema2 = schema.oneOf(
  //   authmethods2.map((authmethod) => schema.literal(authmethod)) as [Type<string>]
  // );
  router.post(
    {
      path: '/internal/data-source-management/validate',
      validate: {
        body: schema.object({
          id: schema.maybe(schema.string()),
          dataSourceAttr: schema.object({
            endpoint: schema.string(),
            auth: schema.maybe(
              schema.object({
                type: allAuthMethodSchema(authRegistry),
                credentials: schema.oneOf([
                  schema.conditional(
                    schema.siblingRef('type'),
                    AuthType.UsernamePasswordType,
                    UsernamePasswordTypeSchema,
                    schema.never()
                  ),
                  schema.conditional(
                    schema.siblingRef('type'),
                    AuthType.SigV4,
                    SigV4Schema,
                    schema.never()
                  ),
                  // schema.conditional(
                  //   schema.siblingRef('type'),
                  //   AuthType.NoAuth,
                  //   schema.object({}),
                  //   schema.never()
                  // ),
                  schema.conditional(
                    schema.siblingRef('type'),
                    authRegistryAuthMethodSchema(authRegistry),
                    schema.any(),
                    schema.never()
                  ),
                ]),
              })
            ),
          }),
        }),
      },
    },
    async (context, request, response) => {
      const { dataSourceAttr, id: dataSourceId } = request.body;

      try {
        const dataSourceClient: OpenSearchClient = await dataSourceServiceSetup.getDataSourceClient(
          {
            savedObjects: context.core.savedObjects.client,
            cryptography,
            dataSourceId,
            testClientDataSourceAttr: dataSourceAttr as DataSourceAttributes,
            request,
            authRegistry,
            customApiSchemaRegistryPromise,
          }
        );

        const dataSourceValidator = new DataSourceConnectionValidator(
          dataSourceClient,
          dataSourceAttr
        );

        await dataSourceValidator.validate();

        return response.ok({
          body: {
            success: true,
          },
        });
      } catch (err) {
        return response.customError({
          statusCode: err.statusCode || 500,
          body: {
            message: err.message,
            attributes: {
              error: err.body?.error || err.message,
            },
          },
        });
      }
    }
  );
};

const UsernamePasswordTypeSchema = schema.object({
  username: schema.string(),
  password: schema.string(),
});

const SigV4Schema = schema.object({
  region: schema.string(),
  accessKey: schema.string(),
  secretKey: schema.string(),
  service: schema.oneOf([
    schema.literal(SigV4ServiceName.OpenSearch),
    schema.literal(SigV4ServiceName.OpenSearchServerless),
  ]),
});

const getAuthMethodNamesFromRegistry = (authRegistry: IAuthenticationMethodRegistery): string[] => {
  const registryAuthMethods = authRegistry.getAllAuthenticationMethods();
  const registryAuthNames = registryAuthMethods.map((method) => method.name);
  return registryAuthNames;
};

const authRegistryAuthMethodSchema = (authRegistry: IAuthenticationMethodRegistery) => {
  let registryAuthNames = getAuthMethodNamesFromRegistry(authRegistry);
  registryAuthNames = [...registryAuthNames, AuthType.NoAuth];
  return schema.oneOf(
    registryAuthNames.map((authmethod) => schema.literal(authmethod)) as [Type<string>]
  );
};

const allAuthMethodSchema = (authRegistry: IAuthenticationMethodRegistery) => {
  const registryAuthNames = getAuthMethodNamesFromRegistry(authRegistry);
  const allAuthMethods = [
    ...registryAuthNames,
    AuthType.NoAuth,
    AuthType.UsernamePasswordType,
    AuthType.SigV4,
  ];
  return schema.oneOf(
    allAuthMethods.map((authmethod) => schema.literal(authmethod)) as [Type<string>]
  );
};
