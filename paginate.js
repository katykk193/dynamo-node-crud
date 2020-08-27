const async = require('async');
const _ = require('underscore');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-2' });

const docClient = new AWS.DynamoDB.DocumentClient();

let startKey = [];
let results = [];
let pages = 0;

async.doWhilst(
  // iteratee
  (callback) => {
    console.log('iteratee');
    console.log(startKey);
    let params = {
      TableName: 'td_notes_sdk',
      Limit: 3
    };
    if (!_.isEmpty(startKey)) {
      params.ExclusiveStartKey = startKey;
    }
    docClient.scan(params, (err, data) => {
      if (err) {
        console.log(err);
        callback(err, {});
      } else {
        console.log('scan');
        console.log(data.LastEvaluatedKey);
        if (typeof data.LastEvaluatedKey !== 'undefined') {
          startKey = data.LastEvaluatedKey;
        } else {
          startKey = [];
        }
        // console.log('item', data.Items);
        if (!_.isEmpty(data.Items)) {
          results = _.union(results, data.Items);
        }
        pages++;
        console.log(results);
        callback(null, results);
      }
    });
  },

  // truth test
  (results, callback) => {
    console.log('truth');
    console.log(startKey);
    if (_.isEmpty(startKey)) {
      return callback(null, false);
    } else {
      return callback(null, true);
    }
  },

  // callback
  (err, data) => {
    console.log('callback');
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      console.log('Item count', data.length);
      console.log('Pages', pages);
    }
  }
);
