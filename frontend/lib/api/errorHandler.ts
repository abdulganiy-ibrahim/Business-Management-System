import axios from 'axios';

export function getUserFriendlyError(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "Something went wrong. Please try again.";
  }

  if (!error.response) {
    return "Unable to connect to the server. Please check your internet connection"
  }

  switch (error.response.status) {
    case 400:
      return "Please check the information you enter";

    case 401:
      return "Please sign in to continue";

    case 403:
      return "You don't have permission to perform this action.";

    case 404:
      return "The requested resource could not be found.";

    case 409:
      return "This information already exists.";

    case 500:
      return "Something went wrong on our server. Please try again.";

    default:
      return "Something went wrong. Please try again";
  }
}