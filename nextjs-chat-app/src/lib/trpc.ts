import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/api/root';

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createTRPCReact`
 * @link https://trpc.io/docs/client/react
 */
export const trpc = createTRPCReact<AppRouter>();
