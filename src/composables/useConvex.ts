import { ref, computed, onMounted, onUnmounted, inject, watch } from 'vue';
import { ConvexClient } from 'convex/browser';
import type { FunctionReference, OptionalRestArgs } from 'convex/server';

// Symbol for dependency injection
export const ConvexClientKey = Symbol('ConvexClient');

// Inject the Convex client
export function useConvexClient() {
  const client = inject<ConvexClient>(ConvexClientKey);
  if (!client) {
    throw new Error('Convex client not provided. Make sure to provide the ConvexClient in your app setup.');
  }
  return client;
}

// useQuery composable for reactive queries
export function useQuery<Query extends FunctionReference<'query'>>(
  query: Query,
  argsSource: any
): any {
  const client = useConvexClient();
  const data = ref<any>(undefined);
  const isLoading = ref(true);
  const error = ref<Error | null>(null);
  let unsubscribe: (() => void) | null = null;

  const subscribe = (queryArgs: any) => {
    // Clean up previous subscription
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    // Handle 'skip' case
    if (queryArgs === 'skip') {
      isLoading.value = false;
      data.value = null;
      return;
    }

    try {
      isLoading.value = true;
      // Use onUpdate for reactive subscriptions
      unsubscribe = client.onUpdate(query, queryArgs || {}, (newValue: any) => {
        data.value = newValue;
        isLoading.value = false;
        error.value = null;
      });
    } catch (e) {
      error.value = e as Error;
      isLoading.value = false;
      console.error('Query subscription error:', e);
    }
  };

  // Always watch the args source (works for both plain values and computed refs)
  watch(
    () => {
      // If it's a computed ref or ref, get its value
      return typeof argsSource === 'function' ? argsSource() :
             (argsSource?.value !== undefined ? argsSource.value : argsSource);
    },
    (newArgs) => {
      subscribe(newArgs);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return computed(() => data.value);
}

// useMutation composable for mutations
export function useMutation<Mutation extends FunctionReference<'mutation'>>(
  mutation: Mutation
) {
  const client = useConvexClient();

  return async (...args: OptionalRestArgs<Mutation>): Promise<any> => {
    try {
      return await client.mutation(mutation, args[0] || {});
    } catch (e) {
      console.error('Mutation error:', e);
      throw e;
    }
  };
}

// useAction composable for actions
export function useAction<Action extends FunctionReference<'action'>>(
  action: Action
) {
  const client = useConvexClient();

  return async (...args: OptionalRestArgs<Action>): Promise<any> => {
    try {
      return await client.action(action, args[0] || {});
    } catch (e) {
      console.error('Action error:', e);
      throw e;
    }
  };
}
