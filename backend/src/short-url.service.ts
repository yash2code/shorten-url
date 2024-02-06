import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortUrl } from './short-url.entity';
import * as moment from 'moment-timezone';
import { base62 } from './utils';
import { Analytics } from './analytics.entity';
import { Transactional } from 'nestjs-transaction';
import { Snowflake } from 'nodejs-snowflake';

@Injectable()
export class ShortUrlService {
    private defaultExpiryMinutes: number;
    private readonly snowflakeIdGenerator: Snowflake;

    constructor(
        @InjectRepository(ShortUrl)
        private shortUrlRepository: Repository<ShortUrl>,
        @InjectRepository(Analytics)
        private analyticsRepository: Repository<Analytics>,
    ) {
        this.snowflakeIdGenerator = new Snowflake({
            instance_id: 1
        });
        this.defaultExpiryMinutes = parseInt(process.env.SHORT_URL_EXPIRY) || 5; // Default to 5 minutes

    }

    @Transactional()
    async createShortUrl(originalUrl: string, expiryTime: number): Promise<ShortUrl> {
        const shortUrl = new ShortUrl();
        shortUrl.originalUrl = originalUrl;

        const uniqueId = this.snowflakeIdGenerator.getUniqueID()

        shortUrl.id = uniqueId.toString()

        const idToBase62 = base62.encode(uniqueId as bigint)
        shortUrl.shortAlias = idToBase62

        const expiryDate = expiryTime ? moment().tz("UTC").add(expiryTime, 'minutes').toDate() : moment().tz("UTC").add(this.defaultExpiryMinutes, 'minutes').toDate();
        shortUrl.expiryDate = expiryDate;

        return this.shortUrlRepository.save(shortUrl);
    }

    async findByAlias(alias: string): Promise<ShortUrl | null> {
        return await this.shortUrlRepository.findOne({ where: { shortAlias: alias } });
    }

    async findAll(): Promise<ShortUrl[]> {
        return await this.shortUrlRepository.find({
            order: {
                createdAt: 'desc'
            }
        });
    }

    async trackAccess(alias: string): Promise<void> {
        const shortUrl = await this.shortUrlRepository.findOne({ where: { shortAlias: alias } });

        if (!shortUrl) {
            throw new Error("Short URL not found");
        }

        const analytics = await this.analyticsRepository.findOne({ where: { shortUrl: shortUrl } });

        if (analytics) {
            analytics.accessCount += 1;
            analytics.accessedAt = new Date();
            await this.analyticsRepository.save(analytics);
        } else {
            const newAnalytics = this.analyticsRepository.create({
                shortUrl: shortUrl,
                accessCount: 1,
                accessedAt: new Date()
            });
            await this.analyticsRepository.save(newAnalytics);
        }
    }

    async getAnalytics(): Promise<any> {
        const analyticsData = await this.analyticsRepository
            .createQueryBuilder('analytics')
            .select('analytics.shortUrlId', 'shortUrlId')
            .addSelect('COUNT(analytics.id)', 'totalClicks')
            .groupBy('analytics.shortUrlId')
            .getRawMany();

        return analyticsData;
    }

}
