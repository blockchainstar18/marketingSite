const express = require('express');
const router = express.Router();
const config = require('config');
const ShortenLink = require('../../models/ShortenLink')
const Indicator = require('../../models/Indicator');

router.post('/',
    async (req, res) => {
        const { originLink, shortenLink } = req.body
        const { Country, Language, Browser, Device, TimeOnPage, Today } = req.body

        let Link = await ShortenLink.findOne({ originLink })
        if (!Link) {
            Link = new ShortenLink({
                originLink,
                shortenLink
            })
            await Link.save()
        }

        let Indicator_ = new Indicator({
            Link,
            Country,
            Language,
            Browser,
            Device,
            TimeOnPage,
            Today
        })
        await Indicator_.save()
        // res.json(await Indicator.find())
        // res.json(await ShortenLink.find())
        res.json(true)
    })

router.get('/',
    async (req, res) => {
        const originLink = req.query.data
        let Link = await ShortenLink.findOne({ originLink })
        res.json(Link)
    })

router.get('/getIndicator',
    async (req, res) => {
        const Link = req.query.data
        // const { shortenLink } = req.body
        let Indicator_ = await Indicator.find({ Link })
        res.json(Indicator_)
    })

router.get('/ShortenLinkCounts',
    async (req, res) => {
        res.json(await ShortenLink.countDocuments())
    })
router.get('/IndicatorCounts',
    async (req, res) => {
        res.json(await Indicator.countDocuments())
    })

module.exports = router