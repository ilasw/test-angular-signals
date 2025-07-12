import * as bcrypt from 'bcrypt';

export const crypt = (text: string, rounds = 10) => {
  return bcrypt.hash(text, rounds);
};

export const compare = (text: string, hash: string) => {
  return bcrypt.compare(text, hash);
}