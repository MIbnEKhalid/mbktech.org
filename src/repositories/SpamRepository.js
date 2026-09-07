import { BaseRepository } from "mbkauthe";
import { defaultAdapter } from "../db/index.js";

export class SpamRepository extends BaseRepository {
  constructor(adapter = defaultAdapter) {
    super(adapter);
  }

  /**
   * Retrieves all active blocked entries ordered by creation date.
   */
  async getBlockedEntries() {
    const { rows } = await this.query(
      "SELECT * FROM mbkcore_blocked_entries WHERE is_active = true ORDER BY created_at DESC"
    );
    return rows || [];
  }

  /**
   * Adds a new blocked entry (email, phone, or keyword).
   */
  async addBlockedEntry(type, value, reason, createdBy) {
    const { rows } = await this.query(
      `INSERT INTO mbkcore_blocked_entries (type, value, reason, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, type, value, reason, created_at, is_active`,
      [type, value, reason || null, createdBy || "system"]
    );
    return rows[0];
  }

  /**
   * Soft-removes a blocked entry by ID.
   */
  async removeBlockedEntry(id) {
    const { rows } = await this.query(
      "UPDATE mbkcore_blocked_entries SET is_active = false WHERE id = $1 RETURNING id",
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Finds an active blocked entry by type and value.
   */
  async findBlocked(type, value) {
    const { rows } = await this.query(
      "SELECT * FROM mbkcore_blocked_entries WHERE type = $1 AND value = $2 AND is_active = true",
      [type, value]
    );
    return rows[0] || null;
  }

  /**
   * Retrieves all active blocked keywords.
   */
  async getActiveKeywords() {
    const { rows } = await this.query(
      "SELECT value, reason FROM mbkcore_blocked_entries WHERE type = 'keyword' AND is_active = true"
    );
    return rows || [];
  }
}

export const spamRepository = new SpamRepository();
export default spamRepository;
