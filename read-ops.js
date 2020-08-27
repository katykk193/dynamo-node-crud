const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-2' });

const docClient = new AWS.DynamoDB.DocumentClient();

docClient.get(
  {
    TableName: 'td_notes_sdk',
    Key: {
      user_id: '11',
      timestamp: 1
    }
  },
  (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  }
);

// search within a single partition
docClient.query(
  {
    TableName: 'td_notes_sdk',
    KeyConditionExpression: 'user_id = :uid',
    ExpressionAttributeValues: {
      ':uid': '11'
    }
  },
  (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  }
);

// retrieve items across partitions
docClient.scan(
  {
    TableName: 'td_notes_sdk',
    FilterExpression: 'content = :content',
    ExpressionAttributeValues: {
      ':content': 'Content 11'
    }
  },
  (err, data) => {
    if (err) console.log(err);
    else console.log(data);
  }
);

// docClient.batchGet
