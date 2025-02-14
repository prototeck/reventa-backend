import * as mongoose from 'mongoose';

export const LOCATION_SCHEMA = new mongoose.Schema(
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

export const ADDRESS_SCHEMA = new mongoose.Schema(
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

export const TICKET_SCHEMA = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['free', 'paid'],
    required: true,
  },
  currency: {
    type: String,
  },
  price: {
    type: Number,
  },
  startsOn: {
    type: Number,
    required: true,
  },
  endsOn: {
    type: Number,
    required: true,
  },
});

export const EVENT_SCHEMA = new mongoose.Schema(
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
      type: LOCATION_SCHEMA,
      required: true,
    },
    address: {
      type: ADDRESS_SCHEMA,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    mainImageUrl: {
      type: String,
    },
    secondaryImageUrls: {
      type: [String],
      default: [],
    },
    tickets: {
      type: [TICKET_SCHEMA],
    },
    createdOn: {
      type: Number,
      default: Date.now,
    },
    updatedOn: {
      type: Number,
      default: Date.now,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'events',
  },
);

EVENT_SCHEMA.index({ location: '2dsphere' });
