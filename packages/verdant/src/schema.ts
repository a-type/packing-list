import { collection, schema } from '@verdant-web/store';
import cuid from 'cuid';

const lists = collection({
  name: 'list',
  primaryKey: 'id',
  fields: {
    id: {
      type: 'string',
      default: cuid,
    },
    createdAt: {
      type: 'number',
      default: () => Date.now(),
      indexed: true,
    },
    name: {
      type: 'string',
      default: 'New List',
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            default: cuid,
          },
          description: {
            type: 'string',
            default: '',
          },
          quantity: {
            type: 'number',
            default: 1,
          },
          perDays: {
            type: 'number',
            default: 0,
          },
          additional: {
            type: 'number',
            default: 0,
          },
          roundDown: {
            type: 'boolean',
            default: false,
          },
        },
      },
    },
  },
});

const trips = collection({
  name: 'trip',
  primaryKey: 'id',
  fields: {
    id: {
      type: 'string',
      default: cuid,
    },
    createdAt: {
      type: 'number',
      default: () => Date.now(),
      indexed: true,
    },
    lists: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    days: {
      type: 'number',
      default: 1,
    },
    name: {
      type: 'string',
      default: 'New Trip',
    },
    completions: {
      type: 'map',
      values: {
        type: 'object',
        properties: {
          quantity: {
            type: 'number',
          },
        },
      },
    },
  },
});

export default schema({
  version: 1,
  collections: {
    lists,
    trips,
  },
});
