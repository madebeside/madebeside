export function sqliteBinding(db) {
  return {
    prepare(sql) {
      return {
        bind(...values) {
          return {
            async run() {
              const result = db.prepare(sql).run(...values);
              return { success: true, meta: { changes: Number(result.changes) } };
            },
            async first() { return db.prepare(sql).get(...values) || null; },
            async all() { return {results:db.prepare(sql).all(...values)}; }
          };
        }
      };
    }
  };
}
