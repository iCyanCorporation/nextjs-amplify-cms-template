import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'homepage-storage',
  access: (allow) => ({
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    // 'images/*': [
    //   allow.authenticated.to(['read', 'write', 'delete']),
    //   allow.guest.to(['read'])
    // ],
    'public/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
    'public/images/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ]
  })
});