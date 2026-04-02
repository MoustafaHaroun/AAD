import 'dotenv';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioClient implements OnModuleInit {
  private readonly client: Minio.Client;
  private readonly bucketName: string;

  constructor() {
    this.client = new Minio.Client({
      endPoint: 'minio',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
    });

    this.bucketName = process.env.MINIO_BUCKET ?? '';
  }

  async onModuleInit(): Promise<void> {
    for (let i = 0; i < 10; i++) {
      try {
        if (!(await this.client.bucketExists(this.bucketName))) {
          await this.client.makeBucket(this.bucketName);
        }
      } catch {
        console.info('Waiting for MinIO to be ready...', i + 1);
        await new Promise((res) => setTimeout(res, 2000));
      }
    }
  }

  getClient(): Minio.Client {
    return this.client;
  }

  getBucketName(): string {
    return this.bucketName;
  }

  toObjectName(path: string): string | null {
    const sections = path.split('/');

    if (sections.length > 1) {
      return sections[path.length - 1];
    }

    return null;
  }

  toEndpoint(fileName: string): string {
    return `http://minio/${this.bucketName}/${fileName}`;
  }
}
