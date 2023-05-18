import { ThrottlerModule } from '@nestjs/throttler';
import { Redis } from 'ioredis';

export const ThrottlerConf = ThrottlerModule.forRoot({
  ttl: 120,
  limit: 40,
  storage: Redis,
});
