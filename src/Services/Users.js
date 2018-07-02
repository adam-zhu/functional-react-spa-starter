// @flow
import { type User } from "../Routes/Users/reducer";
import UsersFormatter from "./formatters/Users";
import mocks from "./mocks";

const get_users = async (): Promise<User[]> => {
  const users = await mocks.users();

  return UsersFormatter.format_users(users);
};
export default {
  get_users
};
