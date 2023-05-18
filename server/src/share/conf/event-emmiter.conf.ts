import { EventEmitterModule } from '@nestjs/event-emitter';

export const EventEmmiterConf = EventEmitterModule.forRoot({
  global: true,
  maxListeners: 20,
});
