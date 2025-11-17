declare const window: any;

export const environment = {
  production: true,
  apiUrl: (typeof window !== 'undefined' && window.API_URL) || '/api'
};
