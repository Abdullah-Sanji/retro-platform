import { inject, provide, type InjectionKey } from 'vue';

export interface NotificationAPI {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

export const NotificationKey: InjectionKey<NotificationAPI> = Symbol('notification');

export function provideNotification(api: NotificationAPI) {
  provide(NotificationKey, api);
}

export function useNotification(): NotificationAPI {
  const notification = inject(NotificationKey);
  if (!notification) {
    // Fallback to console if notification system isn't available
    return {
      success: (msg) => console.log('[SUCCESS]', msg),
      error: (msg) => console.error('[ERROR]', msg),
      warning: (msg) => console.warn('[WARNING]', msg),
      info: (msg) => console.info('[INFO]', msg),
    };
  }
  return notification;
}
