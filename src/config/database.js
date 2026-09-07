// Backward-compatibility re-export.
// Prefer importing directly from "#db" or "../db/index.js".
import { pool, defaultAdapter } from "../db/index.js";

export { pool, pool as pool1, defaultAdapter };
export default pool;