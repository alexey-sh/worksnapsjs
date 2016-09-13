"use strict";

var request = require('request');
var xml2js = require('xml2js');
var Q = require('Q');
var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

function BaseClient(token) {
    this.token = token;
    this.request = request.defaults({
        'auth': {
            user: this.token,
            pass: ''
        }
    });
    this.events = new EventEmitter();
}
BaseClient.prototype.transformXML = function transform(obj) {
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    if (typeof obj === 'string') {
        if ((obj === 'false' || obj === 'true')) {
            return obj === 'true';
        }
        else if (isNumeric(obj)) {
            return parseFloat(obj)
        }
    }

    if (!_.isObject(obj)) {
        return obj;
    }
    _.forEach(obj, function (val, key) {
        if (typeof val === 'string') {
            if (val === 'false' || val === 'true') {
                obj[key] = val === 'true';
            }
            else if (isNumeric(val)) {
                obj[key] = parseFloat(val)
            }
        }
        if (_.isArray(val)) {
            obj[key] = val.map(function (item) {
                return transform(item);
            });
        }
        else if (_.isObject(val)) {
            transform(val)
        }
    });
    return obj;
};

BaseClient.prototype.fetch = function (method, url, query, data) {
    var deferred = Q.defer();
    var that = this;
    url += '.xml';
    var options = {
        url: url,
        method: method,
        qs: query,
        body: data
    };
    var start = Date.now();
    this.request(options, function (error, response, body) {
        that.events.emit('request', {url: options.url,time: Date.now() - start, body: body, error: error});
        if (error) {

            deferred.reject(error);
            return
        }
        xml2js.parseString(body, {explicitArray: false}, function (err, result) {
            if (err || (result.reply && result.reply.error_code)) {
                deferred.reject(result);
                return
            }
            result = that.transformXML(result);
            deferred.resolve(result);
        });
    });

    return deferred.promise;
};

BaseClient.prototype.get = function (url, query) {
    return this.fetch('GET', url, query, null);
};

BaseClient.prototype.post = function (url, query, data) {
    return this.fetch('POST', url, query, data);
};

BaseClient.prototype.put = function (url, query, data) {
    return this.fetch('PUT', url, query, data);
};

BaseClient.prototype.remove = function (url, query, data) {
    return this.fetch('DELETE', url, query, data);
};

module.exports = BaseClient;
