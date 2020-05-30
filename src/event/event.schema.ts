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

const AddressSchema = new mongoose.Schema(
  {
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
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
    address: {
      type: AddressSchema,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
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
