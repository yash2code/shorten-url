import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, NotFoundException, BadRequestException, Res } from '@nestjs/common';
import { ShortUrlService } from './short-url.service';
import { Response } from 'express';

@Controller('short-urls')
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body('originalUrl') originalUrl: string, @Body('expiryTime') expiryTime: number) {

    return await this.shortUrlService.createShortUrl(originalUrl, expiryTime);
  }

  @Get()
  async findAll() {

    return await this.shortUrlService.findAll()
  }

  @Get('/analytics')
  async getAnalytics() {

    return this.shortUrlService.getAnalytics();
  }

  @Get(':alias')
  async findOne(@Param('alias') alias: string) {

    return await this.shortUrlService.findByAlias(alias)
  }

  @Get('/r/:alias')
  async redirectToOriginal(@Param('alias') alias: string, @Res() res: Response) {
    const shortUrl = await this.shortUrlService.findByAlias(alias);

    if (!shortUrl) {
      throw new NotFoundException('Short URL not found.');
    }

    if (new Date() > shortUrl.expiryDate) {
      throw new BadRequestException('This short URL has expired.');
    }
    await this.shortUrlService.trackAccess(alias)

    res.redirect(HttpStatus.TEMPORARY_REDIRECT, shortUrl.originalUrl);
  }


}
