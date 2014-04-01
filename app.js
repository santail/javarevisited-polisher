var connect = require('connect'),
    http = require('http')    ,
    cheerio = require('cheerio'),
    request = require('request'),
    url = require('url');

var app = connect()
    .use(connect.favicon())
    .use(connect.logger('dev'))
    .use(connect.static('public'))
    .use(connect.directory('public'))
    .use(connect.cookieParser())
    .use(connect.session({ secret: 'my secret here' }))
    .use(function (req, res) {

        var original = "http://javarevisited.blogspot.com",
            polished = "http://javarevisited.eu01.aws.af.cm";

        var requestUrl = url.parse(req.url);

        request({
            uri: original + requestUrl.path,
            timeout: 30000
        }, function (err, response, body) {
            if (!(err || response.statusCode !== 200) && body) {
                var $ = cheerio.load(body),
                    content = '';

                $.root().find('link').each(function(i, elem) {
                    $(this).remove();
                })
                $.root().find('style').each(function(i, elem) {
                    $(this).remove();
                })
                $.root().find('script').each(function(i, elem) {
                    $(this).remove();
                })
                $.root().find('.comment-form').each(function(i, elem) {
                    $(this).remove();
                })
                $.root().find('.post-footer').each(function(i, elem) {
                    $(this).remove();
                })
                $.root().find('[style]').each(function(i, elem) {
                    $(this).attr( "style", "")
                })

                $.root().find('#Blog1 .date-outer').each(function(i, elem) {
                    content += $(this).html();
                })

                $.root().find('body').html(content);

                $.root().find('body').find('a').each(function(i, el) {
                    var href = $(this).attr('href');

                    if (href) {
                        $(this).attr('href', polished + url.parse(href).path);
                    }
                })

                res.end($.html());
            }
            else {
                console.log('Error: ', err);
                res.end();
            }
        });
    });

http.createServer(app).listen(3000);