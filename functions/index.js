/* eslint-disable no-unused-vars */
/* eslint-disable indent */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');

admin.initializeApp(functions.config().firebase);

const env = functions.config();
const client = algoliasearch(env.algolia.app_id, env.algolia.api_key);
// const index = client.initIndex('googlemap_search');

const ALGOLIA_INDEX_NAME = 'googlemap_search';
const index = client.initIndex(ALGOLIA_INDEX_NAME);

// eslint-disable-next-line no-unused-vars
exports.onMenuCreated = functions.firestore
    .document('menu/{menuId}')
    .onCreate((snap, context) => {
        const data = snap.data();
        const objectID = snap.id;

        return index.saveObject({ objectID, ...data });
    });

// eslint-disable-next-line no-unused-vars
exports.onMenuDelete = functions.firestore
    .document('menu/{menuId}')
    .onDelete((snap, context) => {
        const objectID = snap.id;

        return index.deleteObject(objectID);
    });
