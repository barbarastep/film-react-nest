export class FilmNotFoundError extends Error {
  constructor(public readonly filmId: string) {
    super(`Film with id "${filmId}" not found`);
  }
}

export class SessionNotFoundError extends Error {
  constructor(public readonly sessionId: string) {
    super(`Session with id "${sessionId}" not found`);
  }
}

export class SeatAlreadyTakenError extends Error {
  constructor(public readonly seatKey: string) {
    super(`Seat ${seatKey} is already taken`);
  }
}

export class DuplicateSeatInOrderError extends Error {
  constructor(public readonly seatKey: string) {
    super(`Seat ${seatKey} is duplicated in request`);
  }
}
