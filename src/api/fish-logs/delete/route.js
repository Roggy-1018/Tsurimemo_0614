async function handler({ id }) {
  const result = await sql`
    DELETE FROM fish_logs 
    WHERE id = ${id}
    RETURNING *
  `;

  if (result.length === 0) {
    return null;
  }

  return result[0];
}
export async function POST(request) {
  return handler(await request.json());
}