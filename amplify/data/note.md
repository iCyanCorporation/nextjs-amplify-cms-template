Recommended use case Strategy authMode
Public data access where users or devices are anonymous. Anyone with the AppSync API key is granted access. publicApiKey apiKey
Recommended for production environment's public data access. Public data access where unauthenticated users or devices are granted permissions using Amazon Cognito identity pool's role for unauthenticated identities. guest identityPool
Per user data access. Access is restricted to the "owner" of a record. Leverages amplify/auth/resource.ts Cognito user pool by default. owner/ownerDefinedIn/ownersDefinedIn userPool / oidc
Any signed-in data access. Unlike owner-based access, any signed-in user has access. authenticated userPool / oidc / identityPool
Per user group data access. A specific or dynamically configured group of users has access. group/groupDefinedIn/groups/groupsDefinedIn userPool / oidc
Define your own custom authorization rule within a serverless function. custom lambda
