import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // validate: {
      //   validator: (value) => isEmail(value),
      //   message: (props) => `${props.value} is not a valid e-mail address.`,
      // },
    },
    createdOn: {
      type: Number,
      default: Date.now,
    },
  },
  {
    collection: 'users',
  },
);
