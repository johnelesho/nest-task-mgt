import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator, MemoryHealthIndicator,
  TypeOrmHealthIndicator
} from "@nestjs/terminus";
import { SkipAuth } from "../auth/skip-auth.decorator";

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @SkipAuth()
  check() {
    return this.health.check([
      () => this.http.pingCheck('server', 'http://localhost:5000'),
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.8 }),
    ]);
  }
}
