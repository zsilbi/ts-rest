import type {
  MutationOptions,
  UseMutationReturnType,
} from '@tanstack/vue-query';
import { useMutation } from '@tanstack/vue-query';
import {
  AppRoute,
  AppRouteMutation,
  ClientArgs,
  ClientInferRequest,
  PartialClientInferRequest,
  SchemaOutputOrType,
} from '@ts-rest/core';
import { DataResponse, ErrorResponse, queryFn } from './common';

// Used pn X.useMutation
export type DataReturnMutation<
  TAppRoute extends AppRoute,
  TClientArgs extends ClientArgs,
> = (
  options?: MutationOptions<
    DataResponse<TAppRoute>,
    ErrorResponse<TAppRoute>,
    PartialClientInferRequest<TAppRoute, TClientArgs>,
    unknown
  >,
) => UseMutationReturnType<
  DataResponse<TAppRoute>,
  ErrorResponse<TAppRoute>,
  PartialClientInferRequest<TAppRoute, TClientArgs>,
  unknown
>;

export const getRouteUseMutation =
  <TAppRoute extends AppRoute, TClientArgs extends ClientArgs>(
    route: TAppRoute,
    clientArgs: TClientArgs,
  ) =>
  (options?: MutationOptions<TAppRoute['responses']>) => {
    const mutationFunction = async (
      args?: ClientInferRequest<AppRouteMutation, ClientArgs>,
    ) => {
      const dataFn = queryFn(route, clientArgs, args);

      return dataFn(undefined as any);
    };

    return useMutation({
      mutationFn: mutationFunction as () => Promise<
        SchemaOutputOrType<TAppRoute['responses']>
      >,
      ...options,
    });
  };
