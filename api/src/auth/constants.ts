export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'WEE_WOO_MON_AMI',
  expiresIn: '1h',
};
