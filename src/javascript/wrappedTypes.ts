interface AnalyticsApi {
  management: typeof gapi.client.management;
}

export type AccountSummary = gapi.client.analytics.AccountSummary;
export type WebPropertySummary = gapi.client.analytics.WebPropertySummary;
export type ProfileSummary = gapi.client.analytics.ProfileSummary;

export const getAnalyticsApi = async (): Promise<AnalyticsApi> => {
  const ready = new Promise<void>((resolve, reject) => {
    (gapi as any).analytics.ready(() => {
      resolve();
    });
  });
  await ready;
  const authorize = new Promise<void>((resolve, reject) => {
    if ((gapi as any).analytics.auth.isAuthorized()) {
      resolve();
    } else {
      (gapi as any).analytics.auth.once("success", () => {
        resolve();
      });
    }
  });
  await authorize;
  await gapi.client.load("analytics", "v3");
  return (gapi as any).client.analytics;
};
