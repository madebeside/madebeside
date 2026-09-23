export function inquiryStore(env){
  if(!env.DB?.prepare)throw new Error('Inquiry storage unavailable');
  return {
    async purge(now){return env.DB.prepare('DELETE FROM inquiries WHERE expires_at <= ?').bind(now).run();},
    async find(id){return env.DB.prepare('SELECT email, message, name FROM inquiries WHERE id = ?').bind(id).first();},
    async recent(email,since){return env.DB.prepare('SELECT COUNT(*) AS count FROM inquiries WHERE email = ? AND received_at > ?').bind(email,since).first();},
    async save(entry){return env.DB.prepare('INSERT OR IGNORE INTO inquiries (id, name, email, message, received_at, expires_at, consent_version) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(entry.id,entry.name||null,entry.email,entry.message,entry.receivedAt,entry.expiresAt,entry.consentVersion).run();},
  };
}
