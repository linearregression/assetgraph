/*global describe, it*/
var expect = require('../unexpected-with-plugins'),
    AssetGraph = require('../../lib');

describe('relations/HtmlServiceWorkerRegistration', function () {
    it('should populate the relation', function (done) {
        new AssetGraph({root: __dirname + '/../../testdata/relations/HtmlServiceWorkerRegistration'})
            .loadAssets('index.html')
            .populate()
            .queue(function (assetGraph) {
                expect(assetGraph, 'to contain relations', 'HtmlServiceWorkerRegistration', 1);
                expect(assetGraph, 'to contain assets', 'JavaScript', 1);
            })
            .run(done);
    });

    it('should read the href correctly', function (done) {
        new AssetGraph({root: __dirname + '/../../testdata/relations/HtmlServiceWorkerRegistration'})
            .loadAssets('index.html')
            .queue(function (assetGraph) {
                expect(assetGraph, 'to contain relations including unresolved', 'HtmlServiceWorkerRegistration', 1);

                var relation = assetGraph.findRelations({ type: 'HtmlServiceWorkerRegistration' }, true)[0];

                expect(relation, 'to satisfy', {
                    href: 'service-worker.js'
                });
            })
            .run(done);
    });

    it('should write the href correctly', function (done) {
        new AssetGraph({root: __dirname + '/../../testdata/relations/HtmlServiceWorkerRegistration'})
            .loadAssets('index.html')
            .populate()
            .queue(function (assetGraph) {
                expect(assetGraph, 'to contain relations', 'HtmlServiceWorkerRegistration', 1);

                var relation = assetGraph.findRelations({ type: 'HtmlServiceWorkerRegistration' }, true)[0];

                expect(relation, 'to satisfy', {
                    href: 'service-worker.js',
                    from: {
                        text: expect.it('not to contain', 'static/serviceworker.js')
                    }
                });

                relation.to.url = 'static/serviceworker.js';

                expect(relation, 'to satisfy', {
                    href: 'static/serviceworker.js',
                    from: {
                        text: expect.it('to contain', 'static/serviceworker.js')
                    }
                });
            })
            .run(done);
    });

    it('should throw when inlining', function (done) {
        new AssetGraph({root: __dirname + '/../../testdata/relations/HtmlServiceWorkerRegistration'})
            .loadAssets('index.html')
            .populate()
            .queue(function (assetGraph) {
                var relation = assetGraph.findRelations({ type: 'HtmlServiceWorkerRegistration' })[0];

                expect(relation.inline, 'to throw', 'HtmlServiceWorkerRegistration.inline(): Not allowed');
            })
            .run(done);
    });

    describe('#attach', function () {
        it('should throw when attaching more than one HtmlServiceWorkerRegistration to the same Html asset', function (done) {
            new AssetGraph({root: __dirname + '/../../testdata/relations/HtmlServiceWorkerRegistration'})
                .loadAssets('index.html')
                .populate()
                .queue(function (assetGraph) {
                    expect(assetGraph, 'to contain relations', 'HtmlServiceWorkerRegistration', 1);
                    expect(assetGraph, 'to contain assets', 'JavaScript', 1);

                    var html = assetGraph.findAssets({ type: 'Html' })[0];

                    var relation = new AssetGraph.HtmlServiceWorkerRegistration({
                        to: {
                            url: 'sw.js',
                            text: 'console.log("foo");'
                        }
                    });

                    expect(function () {
                        relation.attach(html);
                    }, 'to throw', /Html asset already has a HtmlServiceWorkerRegistration relation/);
                })
                .run(done);
        });

        it('should attach a node', function (done) {
            new AssetGraph({root: __dirname + '/../../testdata/relations/HtmlServiceWorkerRegistration'})
                .loadAssets({
                    url: 'blank.html',
                    text: '<!DOCTYPE html><html><head></head><body></body></html>'
                })
                .queue(function (assetGraph) {
                    expect(assetGraph, 'to contain asset', 'Html');
                    var html = assetGraph.findAssets({ type: 'Html' })[0];

                    var relation = new AssetGraph.HtmlServiceWorkerRegistration({
                        to: {
                            url: 'sw.js',
                            text: 'console.log("foo");'
                        }
                    });

                    relation.attach(html, 'after');
                })
                .run(done);
        });
    });

    it('should throw when attaching', function (done) {
        new AssetGraph({root: __dirname + '/../../testdata/relations/HtmlServiceWorkerRegistration'})
            .loadAssets('index.html')
            .populate()
            .queue(function (assetGraph) {
                var relation = assetGraph.findRelations({ type: 'HtmlServiceWorkerRegistration' })[0];


                expect(function () {
                    relation.attach(relation.from, 'before', relation);
                }, 'to throw', 'HtmlServiceWorkerRegistration.attach(): Not implemented');
            })
            .run(done);
    });
});
