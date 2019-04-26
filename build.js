#!/usr/bin/env node

console.log('    ___ _       _______    __________    __  ______  __   ____  ___    ____ ');
console.log('   /   | |     / / ___/   / ___|__  /   / / / / __ \\/ /  / __ \\/   |  / __ \\');
console.log('  / /| | | /| / /\\__ \\    \\__ \\ /_ <   / / / / /_/ / /  / / / / /| | / / / /');
console.log(' / ___ | |/ |/ /___/ /   ___/ ___/ /  / /_/ / ____/ /__/ /_/ / ___ |/ /_/ / ');
console.log('/_/  |_|__/|__//____/   /____/____/   \\____/_/   /_____\\____/_/  |_/_____/  ');

const crypto = require('crypto');
const fs = require('fs');

var targetFolder = './target';

if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder);
}

const propertiesReader = require('properties-reader');
const awsProperties = propertiesReader('resources/aws.properties');

const awsAccessKeyId = awsProperties.get('awsAccessKeyId');
const awsSecretAccessKey = awsProperties.get('awsSecretAccessKey');
const bucketName = awsProperties.get('bucketName');
const bucketDestinyFolder = awsProperties.get('bucketDestinyFolder');

console.log('');
console.log('\nPROPRIEDADES AWS');
console.log('----------------');
console.log('awsAccessKeyId......: ' + awsAccessKeyId);
console.log('awsSecretAccessKey..: ' + awsSecretAccessKey);
console.log('bucketName..........: ' + bucketName);
console.log('bucketDestinyFolder.: ' + bucketDestinyFolder);

const msPerDay = 3600 * 24 * 60 * 60 * 1000;
const expiration = new Date(Date.now() + msPerDay).toISOString();
const bucketUrl = `https://${bucketName}.s3.amazonaws.com`;

const policy = {
  expiration,
  conditions: [
    ['starts-with', '$key', `${bucketDestinyFolder}/`],
    {
      bucket: bucketName
    },
    {
      acl: 'public-read'
    },
    ['starts-with', '$Content-Type', ''],
    {
      success_action_redirect: `${bucketUrl}/success.html`
    },
  ],
};

const policyB64 = Buffer(JSON.stringify(policy), 'utf-8').toString('base64');

const hmac = crypto.createHmac('sha1', awsSecretAccessKey);
hmac.update(new Buffer(policyB64, 'utf-8'));

const signature = hmac.digest('base64');

console.log('');
console.log('\nBUILD');
console.log('-----');

// Gerando index.html
console.log('Gerando arquivo /target/index.html .......... OK!');
fs.readFile('src/index.template.html', 'utf8', (err, input) => {
  if (err) {
    console.log(err);
  }

  const data = input
    .replace(/%BUCKET_URL%/g, bucketUrl)
    .replace(/%BUCKET_DESTINY_FOLDER%/g, bucketDestinyFolder)
    .replace(/%AWS_ACCESS_KEY%/g, awsAccessKeyId)
    .replace(/%POLICY_BASE64%/g, policyB64)
    .replace(/%SIGNATURE%/g, signature);

  fs.writeFile('target/index.html', data, 'utf8', (e) => {
    if (e) {
      console.log(e);
    }
  });
});

// Gerando index-progress.html
console.log('Gerando arquivo /target/index-progress.html . OK!');
fs.readFile('src/index-progress.template.html', 'utf8', (err, input) => {
  if (err) {
    console.log(err);
  }

  const data = input
    .replace(/%BUCKET_URL%/g, bucketUrl)
    .replace(/%BUCKET_DESTINY_FOLDER%/g, bucketDestinyFolder)
    .replace(/%AWS_ACCESS_KEY%/g, awsAccessKeyId)
    .replace(/%POLICY_BASE64%/g, policyB64)
    .replace(/%SIGNATURE%/g, signature);

  fs.writeFile('target/index-progress.html', data, 'utf8', (e) => {
    if (e) {
      console.log(e);
    }
  });
});

// Gerando success.html
console.log('Gerando arquivo /target/success.html ........ OK!');
fs.readFile('src/success.template.html', 'utf8', (err, input) => {
  if (err) {
    console.log(err);
  }

  const data = input
    .replace(/%BUCKET_NAME%/g, bucketName);

  fs.writeFile('target/success.html', data, 'utf8', (e) => {
    if (e) {
      console.log(e);
    }
  });
});

// Gerando error.html
console.log('Gerando arquivo /target/error.html .......... OK!');
fs.readFile('src/error.template.html', 'utf8', (err, input) => {
  if (err) {
    console.log(err);
  }

  const data = input
    .replace(/%BUCKET_NAME%/g, bucketName);

  fs.writeFile('target/error.html', data, 'utf8', (e) => {
    if (e) {
      console.log(e);
    }
  });
});

console.log('\nProjeto finalizado!\n');
