var util = require('util'),
    extendWithGettersAndSetters = require('../util/extendWithGettersAndSetters'),
    HtmlRelation = require('./HtmlRelation');

function HtmlServiceWorkerRegistration(config) {
    HtmlRelation.call(this, config);
}

util.inherits(HtmlServiceWorkerRegistration, HtmlRelation);

extendWithGettersAndSetters(HtmlServiceWorkerRegistration.prototype, {
    get href() {
        return this.node.getAttribute('href');
    },

    set href(href) {
        this.node.setAttribute('href', href);
    },

    attach: function (asset, position, adjacentRelation) {
        this.node = asset.parseTree.createElement('link');
        this.node.setAttribute('rel', 'serviceworker');

        if (typeof this.to.scope === 'string') {
            this.node.setAttribute('scope', this.to.scope);
        }

        if (asset.outgoingRelations.some(function (relation) { return relation.type === 'HtmlServiceWorkerRegistration' })) {
            var err = new Error('HtmlServiceWorkerRegistration.attach(): Html asset already has a HtmlServiceWorkerRegistration relation. Only one is allowed per file');
            err.asset = asset;

            throw err;
        }

        if (adjacentRelation.node.parentNode.nodeName !== 'HEAD') {
            var err = new Error('HtmlServiceWorkerRegistration.attach(): HtmlServiceWorkerRegistration may only be attached in Html <head>');
            err.asset = asset;

            throw err;
        }

        this.attachNodeBeforeOrAfter(position, adjacentRelation);
        return HtmlRelation.prototype.attach.call(this, asset, position, adjacentRelation);
    },

    inline: function () {
        throw new Error('HtmlServiceWorkerRegistration.inline(): Not allowed');
    }
});

module.exports = HtmlServiceWorkerRegistration;
