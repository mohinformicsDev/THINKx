export const environment = {
  production: false,
  atlasUri: 'mongodb+srv://admin:admin@cluster0.vge0z.mongodb.net/thinkx-dev',
  // atlasUri: 'mongodb+srv://thinkx-dev:xTeUvCRE9fTtbcLU@cluster0.9mpwc.mongodb.net/thinkx-dev?retryWrites=true&w=majority',
  port: 3333,
  host: 'http://localhost:3333/v1',
  jwtConstants: {
    secret: 'secretKey',
  },
  admin: {
    username: 'string',
    password: '$2a$10$9fYQF9aVFxd2wml1Oj6jeeUrE1SPpHgE6PcUncLk4Jq40N8s9PJNm',
  },
  hashRounds: 10,
};
