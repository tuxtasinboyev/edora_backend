import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redis_client: Redis;
  private logs = new Logger(RedisService.name);

  constructor() {
    const host = process.env.REDIS_HOST || 'redis';
    const port = Number(process.env.REDIS_PORT) || 6379;

    this.redis_client = new Redis({
      host,
      port,
    });

    this.redis_client.on('connect', () => {
      this.logs.log('✅ Redis ulandi');
    });

    this.redis_client.on('error', (err) => {
      this.logs.error('❌ Redisda xatolik:', err);
    });
  }


  onModuleInit() {

  }



  async set(key: string, code: string, ttlSeconds: number) {
    return this.redis_client.set(key, code, 'EX', ttlSeconds);
  }

  async get(key: string) {
    return this.redis_client.get(key);
  }

  async delete(key: string) {
    return this.redis_client.del(key);
  }
}
