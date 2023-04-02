import { Request, Response } from 'express';
import { URL } from 'url';
import { MoreThan } from 'typeorm';
import { dataSource } from '../data-source';
import { redisClient } from '../redis';
import { Url } from '../entity/url';
import { number10to62, validateUrl } from '../util/common';
import { DETAULT_EXPIRE_TIME, SHORT_URL_PREFIX } from '../util/const';

export const generateShortUrl = async (req: Request, res: Response) => {
    try {
        const { url } = req.body;

        // 验证url合法性
        if (!validateUrl(url)) {
            return res.json({
                code: 400,
                message: 'Invalid url',
                data: null,
            });
        }

        const urlRepositry = dataSource.getRepository(Url);

        // 如果已经转换过直接返回
        const converted = await urlRepositry.findOne({
            select: ['keyword'],
            where: {
                url,
            },
        });

        if (converted) {
            return res.json({
                code: 200,
                message: 'Succeeded',
                data: `${SHORT_URL_PREFIX}${converted.keyword}`,
            });
        }

        // 寻找最后一个id
        const last = await urlRepositry.findOne({
            select: ['id'],
            where: { id: MoreThan(0) },
            order: {
                id: 'desc',
            },
        });
        const id = (last?.id ?? 0) + 1;

        // 将数字id转为62进制
        const shortUrl = number10to62(id);

        // 结果储存到mysql
        await urlRepositry
            .createQueryBuilder()
            .insert()
            .into(Url)
            .values({
                url,
                keyword: shortUrl,
            })
            .execute();

        // 存储到redis
        await redisClient.set(`${SHORT_URL_PREFIX}${shortUrl}`, url, 'EX', DETAULT_EXPIRE_TIME);

        // 返回结果
        return res.json({
            code: 200,
            message: 'Succeeded',
            data: `${SHORT_URL_PREFIX}${shortUrl}`,
        });
    } catch (err) {
        return res.json({
            code: 500,
            message: 'server error',
            data: err,
        });
    }
};

export const getOriginUrl = async (req: Request, res: Response) => {
    try {
        const { url } = req.query;

        // 验证url合法性
        if (!validateUrl(url as string)) {
            return res.json({
                code: 400,
                message: 'Invalid url',
                data: null,
            });
        }

        const originUrl = await redisClient.get(url as string);

        // 如果redis查不到url就从mysql查询
        if (!originUrl) {
            const urlRepositry = dataSource.getRepository(Url);

            const keyword = new URL(url as string).pathname.slice(1);

            const urlEntity = await urlRepositry.findOne({
                select: ['url'],
                where: { keyword },
            });

            if (urlEntity) {
                // 查询过后再把结果存入redis
                await redisClient.set(url as string, urlEntity.url, 'EX', DETAULT_EXPIRE_TIME);
                return res.json({
                    code: 200,
                    message: 'Succeeded',
                    data: urlEntity.url,
                });
            }

            return res.json({
                code: 400,
                message: 'Url dose not exist',
                data: null,
            });
        }
        return res.json({
            code: 200,
            message: 'Succeeded',
            data: originUrl,
        });
    } catch (err) {
        return res.json({
            code: 500,
            message: 'server error',
            data: err,
        });
    }
};
