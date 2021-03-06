/*global describe, it*/
var _ = require('lodash'),
    expect = require('../unexpected-with-plugins'),
    urlTools = require('urltools'),
    AssetGraph = require('../../lib');

describe('relations/HtmlObject', function () {
    it('should handle a test case with an existing <object><param name="src" value="..."></object> construct', function (done) {
        new AssetGraph({root: __dirname + '/../../testdata/relations/HtmlObject/'})
            .loadAssets('index.html')
            .populate()
            .queue(function (assetGraph) {
                expect(assetGraph, 'to contain relations including unresolved', 'HtmlObject', 3);
                expect(assetGraph, 'to contain assets', 'Flash', 3);
                expect(
                    _.map(assetGraph.findRelations({type: 'HtmlObject'}, true), 'href'),
                    'to equal',
                    ['themovie.swf', 'theothermovie.swf', 'yetanothermovie.swf']
                );

                assetGraph.findAssets({type: 'Html'})[0].url = urlTools.resolveUrl(assetGraph.root, 'foo/index.html');
                expect(
                    _.map(assetGraph.findRelations({type: 'HtmlObject'}, true), 'href'),
                    'to equal',
                    ['../themovie.swf', '../theothermovie.swf', '../yetanothermovie.swf']
                );
            })
            .run(done);
    });
});
