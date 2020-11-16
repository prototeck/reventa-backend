export const NOT_FOUND = (entity: string) => `${entity} not found.`;
export const ALREADY_EXISTS = (entity: string) => `${entity} already exists.`;
export const FIELD_REQUIRED = (field: string) => `${field} is required.`;
export const FIELD_NOT_ALLOWED = (field: string) =>
  `${field} cannot be updated`;

export const COMMON_ERRORS = {
  NOT_FOUND,
  ALREADY_EXISTS,
} as const;

export const USER_ERRORS = {
  NOT_FOUND: NOT_FOUND('User'),
  ALREADY_EXISTS: ALREADY_EXISTS('User'),
  ALREADY_EXISTS_WITH_EMAIL: ALREADY_EXISTS('User with email'),
} as const;

export const EVENT_ERRORS = {
  NOT_FOUND: NOT_FOUND('Event'),
  ENDTIME_LESS_THAN_STARTTIME: 'End time cannot be less than Start time',
} as const;

export const TICKET_ERRORS = {
  NOT_FOUND: NOT_FOUND('Ticket'),
  ENDTIME_LESS_THAN_STARTTIME: 'End time cannot be less than Start time',
} as const;

export default {
  FIELD_REQUIRED,
  FIELD_NOT_ALLOWED,
  USER_ERRORS,
  EVENT_ERRORS,
  TICKET_ERRORS,
};
