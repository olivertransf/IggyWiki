import { neon } from "@neondatabase/serverless";

function getSql(): ReturnType<typeof neon> {
  const connectionString =
    process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL or NETLIFY_DATABASE_URL must be set. Add it to .env.local for local dev."
    );
  }
  return neon(connectionString);
}

let _sql: ReturnType<typeof neon> | null = null;
const sqlFn = (...args: unknown[]) => {
  if (!_sql) _sql = getSql();
  return (_sql as any)(...args);
};
export const sql = new Proxy(sqlFn, {
  get(_, prop) {
    if (!_sql) _sql = getSql();
    return (_sql as any)[prop];
  },
}) as ReturnType<typeof neon>;
