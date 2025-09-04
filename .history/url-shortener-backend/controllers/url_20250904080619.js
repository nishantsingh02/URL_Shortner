const { nanoid } = "no";

const URL = require("../models/url");

async function HandleGenrateNewShortUrl(req, res) {
    const body = req.body;
    if(!body.url) {
        return res.status(400).json({
            error: "url is requires"
        })
    }
    const shortId = nanoid(8);
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: []
    })

    return res.json({
        id: `http://localhost:3000/${shortId}`
    })
}

async function handleGetAnaylytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({
        shortId
    });

    return res.json({
        totalClicks : result.visitHistory.length, 
        analytics : result.visitHistory
    })
}

module.exports = {
    HandleGenrateNewShortUrl,
    handleGetAnaylytics
};