/**
 * One-time script: create the Qdrant collection for textbook chunks.
 * Run: node scripts/create-collection.js
 */
import 'dotenv/config';
import { initQdrant } from '../src/services/qdrant.js';

await initQdrant();
console.log('Done.');
