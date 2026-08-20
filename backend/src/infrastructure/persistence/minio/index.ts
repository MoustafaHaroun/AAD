import 'dotenv';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';

interface Endpoint {
  endPoint: string;
  port: number;
  useSSL: boolean;
}

function parseEndpoint(raw: string): Endpoint {
  if (/^https?:\/\//i.test(raw)) {
    const url = new URL(raw);
    const useSSL = url.protocol === 'https:';

    return {
      endPoint: url.hostname,
      port: url.port ? Number(url.port) : useSSL ? 443 : 80,
      useSSL,
    };
  }

  return { endPoint: raw, port: 9000, useSSL: false };
}

@Injectable()
export class MinioClient implements OnModuleInit {
  private readonly client: Minio.Client;
  private readonly bucketName: string;
  private readonly endpoint: Endpoint;
  private readonly logger = new Logger(MinioClient.name);

  constructor() {
    const endpoint = parseEndpoint(process.env.MINIO_HOST ?? 'minio');
    const accessKey = process.env.MINIO_ROOT_USER;
    const bucketName = process.env.MINIO_BUCKET ?? '';

    this.logger.log(
      `Initializing MinIO client — endpoint: ${endpoint.endPoint}:${endpoint.port} (useSSL: ${endpoint.useSSL}), bucket: "${bucketName}", accessKey: ${accessKey ? accessKey : '(not set)'}`,
    );

    if (!accessKey) this.logger.warn('MINIO_ROOT_USER is not set');
    if (!process.env.MINIO_ROOT_PASSWORD)
      this.logger.warn('MINIO_ROOT_PASSWORD is not set');
    if (!bucketName) this.logger.warn('MINIO_BUCKET is not set');

    this.client = new Minio.Client({
      endPoint: endpoint.endPoint,
      port: endpoint.port,
      useSSL: endpoint.useSSL,
      accessKey: process.env.MINIO_ROOT_USER,
      secretKey: process.env.MINIO_ROOT_PASSWORD,
    });

    this.bucketName = bucketName;
    this.endpoint = endpoint;
  }

  async onModuleInit(): Promise<void> {
    this.logger.log(
      `Connecting to MinIO at ${this.endpoint.endPoint}:${this.endpoint.port} (useSSL: ${this.endpoint.useSSL})...`,
    );

    for (let i = 0; i < 10; i++) {
      try {
        const exists = await this.client.bucketExists(this.bucketName);
        if (!exists) {
          this.logger.log(
            `Bucket "${this.bucketName}" not found — creating it`,
          );
          await this.client.makeBucket(this.bucketName);
          this.logger.log(`Bucket "${this.bucketName}" created successfully`);
        } else {
          this.logger.log(`Bucket "${this.bucketName}" already exists — ready`);
        }

        await this.ensurePublicReadPolicy();
        return;
      } catch (err) {
        this.logger.warn(
          `MinIO not ready (attempt ${i + 1}/10): ${(err as Error).message}`,
        );
        await new Promise((res) => setTimeout(res, 2000));
      }
    }

    this.logger.error(
      'Failed to connect to MinIO after 10 attempts — giving up',
    );
  }

  private async ensurePublicReadPolicy(): Promise<void> {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    };

    await this.client.setBucketPolicy(this.bucketName, JSON.stringify(policy));
    this.logger.log(`Bucket "${this.bucketName}" set to public-read`);
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
    const publicUrl = process.env.MINIO_PUBLIC_URL;

    if (!publicUrl) {
      this.logger.warn(
        'MINIO_PUBLIC_URL is not set — falling back to the internal MINIO_HOST, which is likely unreachable from outside the container network',
      );
    }

    const base =
      publicUrl ??
      `${this.endpoint.useSSL ? 'https' : 'http'}://${this.endpoint.endPoint}:${this.endpoint.port}`;

    return `${base.replace(/\/$/, '')}/${this.bucketName}/${fileName}`;
  }
}
