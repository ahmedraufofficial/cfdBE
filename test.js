const request = require('request')
const cheerio = require('cheerio')

const getHtml = () => {
    var options = {
        'method': 'GET',
        'url': `https://uae.dubizzle.com/motors/used-cars/nissan/patrol/?regional_specs=824&regional_specs=825`,
    
    };
    console.log(options)
    return new Promise((resolve, reject) => {
      request(options, function(error, res, body) {
          if (!error && res.statusCode === 200) {
              resolve(body);
          } else {
              reject(error);
          }
      })
  })
}

Array.prototype.sum = function() {
    return this.reduce(function(a, b) {return a+b});
};
  
const htmlDubizzleData = async () => {
    const html = await getHtml();
    const $ = cheerio.load(html);
    const ha = $('.sc-cmkc2d-7.sc-11jo8dj-4').map((index, element) => {
        var elem = $(element).text()
        console.log(elem)
    }).get()
    try {
        return (ha.sum() / ha.length)
    } catch (err) {
        return err
    }
}

const run = async() => {
    await htmlData()
}

run();