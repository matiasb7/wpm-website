export class UserFriendlyError extends Error {
  constructor(error: { message: string }) {
    super(error.message);
    this.name = "UserFriendlyError";
  }
}

export class SocketCustomError extends Error {
  constructor(error: { message: string }) {
    super(error.message);
    this.name = "SocketCustomError";
  }
}

export const ERROR_MESSAGES: Record<string, string> = {
  general: "There was an error, please try again later.",
};
