import { CollectionEntity } from "@/factory/entities/collection.entity";
import { InjectRepository } from "@/factory/typeorm";
import { CronJob } from "@/utils/decorators/cron-job.decorator";
import type { Request, Response } from "express";
import axios from 'axios'


class AuthController {


    async Collect(req: Request, res: Response) {
        try {
            const { email, serviceType, interval, urls } = req.body;
            const collectionRepository = InjectRepository(CollectionEntity)
            for (const url of urls) {
                const newEntry = collectionRepository.create({
                    url: url.path.trim(),
                    username: email.split('@')[0],
                    serviceType,
                    interval: interval.toString()
                });


                await collectionRepository.save(newEntry);
            }
            res.json({ message: "Url is added", result: {}, success: true })
        } catch (error: any) {
            console.log(error)
            res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async Delete(req: Request, res: Response) {

        try {
            await InjectRepository(CollectionEntity).delete({ id: +req.params.id })
            res.json({ message: "Url is deleted", result: {}, success: true })
        } catch (error: any) {
            res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async Update(req: Request, res: Response) {

        try {
            await InjectRepository(CollectionEntity).update({ id: +req.params.id }, {
                url: req.body.url
            })
            res.json({ message: "Url is Updated", result: null, success: true })
        } catch (error: any) {
            res.json({ message: "Something went wrong", result: null, success: false })
        }
    }
    async Fetch(req: Request, res: Response) {
        try {
            const data = await InjectRepository(CollectionEntity).find({ where: { username: req.params.username } })
            res.json({ message: "OK", result: data, success: true })
        } catch (error: any) {
            res.json({ message: "Something went wrong", result: null, success: false })
        }
    }

    @CronJob("EVERY_10_SECONDS")
    async CronJobFunction() {
        const data = await InjectRepository(CollectionEntity).find()
        data.length > 0 &&   data.map((data) => {
            axios.get(data.url)
        })
    }
}

export default new AuthController()