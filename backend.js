/**
 * ChainPay Server (Backward Compatibility Wrapper)
 *
 * Forwards execution to the deep architecture entry point (src/server.js).
 * Preserves compatibility with existing deployment environments (Render, Railway, etc.).
 */

require("./src/server");
