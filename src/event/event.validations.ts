import Joi from 'joi';

import { joiValidate } from '@/utils';

import { LocationInput } from './inputs/location.input';
import { AddressInput } from './inputs/address.input';
import { CreateEventInput } from './inputs/create-event.input';
import { UpdateEventInput } from './inputs/update-event.input';

export const validateLocationInput = Joi.object<LocationInput, LocationInput>({
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required(),
  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required(),
});

export const validateAddressInput = Joi.object<AddressInput, AddressInput>({
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
});

export const validateCreateEventInput = joiValidate<CreateEventInput>({
  title: Joi.string().required(),
  description: Joi.string(),
  startsOn: Joi.date()
    .timestamp('javascript')
    .required(),
  endsOn: Joi.date()
    .timestamp('javascript')
    .required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
  location: validateLocationInput.required(),
  address: validateAddressInput,
});

export const validateUpdateEventInput = joiValidate<UpdateEventInput>({
  title: Joi.string(),
  description: Joi.string(),
  startsOn: Joi.date().timestamp('javascript'),
  endsOn: Joi.date().timestamp('javascript'),
  category: Joi.string(),
  mainImageUrl: Joi.string().uri({ scheme: ['http', 'https'] }),
  secondaryImageUrls: Joi.array().items(
    Joi.string().uri({ scheme: ['http', 'https'] }),
  ),
  tags: Joi.array().items(Joi.string()),
  location: validateLocationInput,
});
