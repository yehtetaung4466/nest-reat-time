## Group chat app 

This is the nest.js back-end group chat project.

### To start the project
- clone the project
- create .env file
 - ##### Set up the env variables
   - DB_URL(postgres)
   - JWT_ACCESS_TOKEN_SECRET
   - JWT_REFRESH_TOKEN_SECRET
   - run `pnpm install`
   - run `pnpm push` to load the postgresql
   - run `pnpm start:dev`

#### Optionally
- run `pnpm studio` to access drizzle studio

### Apis
  - ##### Rest
    - post `/auth/signup`
    - post `/auth/login` obtain pair of token
    - post `/auth/refresh` to get a new pair of token wiht refresh token
    - get `/users/me` to get current user
    - get `/users/:id` to get specific user
    - post `/groups` to make new group
    - get `/groups?name=xxx` to get all group with optional query param name
    - get,post `groups/:groupId/members` to get members of group or join group
  - ##### Web Socket Events
    - ###### Client listens
      - `groupMessages` to get groupsMessage when join a room of group
      - `error` for errors
    - ###### Client Emits
      - `joinRoom` to join a room of a group
      - `createMessage` to make new message to a room of group after joining it 
    - ###### ServerListens
      - `joinRoom`
      - `createMessage`
    - ###### Server Emits
      - `groupMessages`
      - `error`
 