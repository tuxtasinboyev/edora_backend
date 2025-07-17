import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from "ioredis"
@Injectable()
export class RedisService implements OnModuleInit {
    private redis_client: Redis
    private logs = new Logger(RedisService.name)
    onModuleInit() {
        this.redis_client = new Redis()
        this.redis_client.on('connect', () => {
            this.logs.log('redis connected')
        });

        this.redis_client.on('error', (err) => {
           this.logs.error('❌ Redis connection error:', err.message);
        });
    }
    async set(key: string, code: string, ttlSeconds: number) {
        return this.redis_client.set(key, code, "EX", ttlSeconds)
    }
    async get(key: string) {
        return this.redis_client.get(key)
    }
    async delete(key: string) {
        return this.redis_client.del(key)
    }
}
