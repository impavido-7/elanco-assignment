/**
 * All the constants which we use in the app will go here
 */

export const BASE_URL = process.env.REACT_APP_BASE_URL;

// Endpoints for the API
export const API_END_POINTS = {
  raw: process.env.REACT_APP_RAW!,
  applications: process.env.REACT_APP_APPLICATIONS!,
  applicationByName: (applicationName: string) => {
    return `${process.env.REACT_APP_APPLICATIONS!}/${applicationName}`;
  },
  resources: process.env.REACT_APP_RESOURCES!,
  getResourceByName: (resourceName: string) => {
    return `${process.env.REACT_APP_RESOURCES!}/${resourceName}`;
  },
};

export const USERS_DATE_FORMAT = "DD MMM, YYYY";
