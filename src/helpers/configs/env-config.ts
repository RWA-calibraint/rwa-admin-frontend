export const ENV_CONFIGS = {
  THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 'AIzaSyD_FiHj4eww6971nehQJ9cdI5fCMjrX1NQ',
  // eslint-disable-next-line no-warning-comments
  // TODO: Need to upadate this is in future
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://dev-api.rareagora.com/',
};
