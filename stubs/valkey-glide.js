// Empty stub for the optional BullMQ peer dependency `@valkey/valkey-glide`.
//
// `@valkey/valkey-glide` is not installed. BullMQ only loads it lazily via a
// try/catch `require('@valkey/valkey-glide')` (see
// node_modules/bullmq/dist/esm/classes/valkey-glide-client.js) and only uses it
// if `Batch` is a function. Exporting nothing here makes that require succeed
// with an empty module, and BullMQ safely falls back to its own compatibility
// batch implementation.
//
// This stub is referenced from next.config.js in both `turbopack.resolveAlias`
// and webpack `resolve.alias` so module resolution does not fail.
module.exports = {};

