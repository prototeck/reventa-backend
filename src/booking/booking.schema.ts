// import * as mongoose from 'mongoose';

// import { LOCATION_SCHEMA, ADDRESS_SCHEMA } from '../event/event.schema';

// export const BOOKING_STATUSES = Object.freeze({
//   CANCELLED: 'Cancelled',
//   PENDING: 'Pending Confirmation',
//   CONFIRMED: 'Confirmed',
// });

// export const BOOKING_SCHEMA = new mongoose.Schema(
//   {
//     eventId: {
//       type: String,
//       required: true,
//     },
//     ticketId: {
//       type: String,
//       required: true,
//     },
//     userId: {
//       type: String,
//       required: true,
//     },
//     firstName: {
//       type: String,
//       required: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       lowercase: true,
//     },
//     eventTitle: {
//       type: String,
//       required: true,
//     },
//     location: {
//       type: LOCATION_SCHEMA,
//       required: true,
//     },
//     address: {
//       type: ADDRESS_SCHEMA,
//     },
//     ticketName: {
//       type: String,
//       required: true,
//     },
//     startsOn: {
//       type: Number,
//       required: true,
//     },
//     endsOn: {
//       type: Number,
//       required: true,
//     },
//     cancellationReason: {
//       type: String,
//     },
//     status: {
//       type: String,
//       enum: Object.values(BOOKING_STATUSES),
//       index: true,
//     },
//   },
//   {
//     collection: 'bookings',
//   },
// );
