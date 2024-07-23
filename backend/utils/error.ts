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
