const cheerio = require("cheerio");
const axios = require("axios").default;
const _ = require('lodash');
const imageItem = require('../models/entities/ImageItem');
const moment = require('moment');
const mongoosePaginate = require('mongoose-paginate-v2');

var Scraper = require('images-scraper');

const google = new Scraper({
    puppeteer: {
        headless: false,
    },
});

module.exports = {
    getGoogleResult: async (param, callback) => {
        try {
            const searchString = param.searchString;
            const articles = await google.scrape('twice', 1000);

            await imageItem.deleteMany();

            let imagelists = [];
            let i = 1;
            _.each(articles, (v, k) => {
                let imageItem = {};
                imageItem.imageItemId = `${moment().unix()}_${moment(new Date()).format('YYYY/MM/DD')}_twice_${i}`
                imageItem.imageItemLink = v.url;
                imageItem.category = searchString;
                imageItem.status = 1;
                imageItem.createTime = moment(new Date());
                imageItem.updateTime = moment(new Date());
                imageItem.remark = '';

                imagelists.push(imageItem);
                i++;
            })
            imageItem.insertMany(imagelists,(err)=>{

                console.log(err);

            })

            callback('', imagelists);
        } catch (e){
            console.error(
                `ERROR: An error occurred while trying to getGoogleResult`
            );
            callback(e, 0);
        }
    },
    getImageList: async (query, callback) => {
        try {
            let page = query.page ? query.page : 1;
            let offset = 20;

            const options = {
                page: page,
                limit: offset,
                collation: {
                  locale: 'en',
                },
              };
              
            await imageItem.paginate({}, options, function (err, result) {
                let imageList = {};

                imageList.data = result.docs;
                imageList.totalPages = result.totalPages;
                imageList.page = result.page;
                imageList.hasNextPage = result.hasNextPage;
                imageList.nextPage = result.nextPage;
                imageList.hasPrevPage = result.hasPrevPage;
                imageList.prevPage = result.prevPage;
                imageList.pagingCounter = result.pagingCounter;

                callback('', imageList);
            });


        } catch (e) {
            console.error(
                `ERROR: An error occurred while trying to getImageList`
            );
            callback('error', 0);
        }
    }

}