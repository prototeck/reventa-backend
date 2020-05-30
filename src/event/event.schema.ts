import * as mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema(
  {
    // 'location type' schema
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  {
    _id: false,
  },
);

export const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startsOn: {
      type: Number,
      required: true,
    },
    endsOn: {
      type: Number,
      required: true,
    },
    location: {
      type: LocationSchema,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    createdOn: {
      type: Number,
      default: Date.now,
    },
    updatedOn: {
      type: Number,
      default: Date.now,
    },
  },
  {
    collection: 'events',
  },
);

EventSchema.index({ location: '2dsphere' });
