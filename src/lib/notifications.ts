// Browser Notification API helpers.

export function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notificationsPermission(): NotificationPermission {
  if (!notificationsSupported()) return "denied";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return "denied";
  if (Notification.permission === "granted" || Notification.permission === "denied") return Notification.permission;
  return await Notification.requestPermission();
}

export function showNotification(title: string, body: string, icon?: string) {
  if (!notificationsSupported()) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: icon || "/favicon.ico" });
  } catch {
    // ignore
  }
}
