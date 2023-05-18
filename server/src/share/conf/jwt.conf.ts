import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { join } from 'path';

export const JwtConf = JwtModule.register({
  global: true,
  publicKey: readFileSync(
    join(__dirname, '..', '..', '..', 'jwtRS256.key.pub'),
    { encoding: 'utf-8' },
  ),
  privateKey: readFileSync(join(__dirname, '..', '..', '..', 'jwtRS256.key'), {
    encoding: 'utf-8',
  }),
  signOptions: { algorithm: 'RS256', expiresIn: 1800 },
  verifyOptions: { algorithms: ['RS256'] },
});
