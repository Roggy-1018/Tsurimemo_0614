async function handler({ date, fish_type, location, size, memo }) {
  const result = await sql`
    INSERT INTO fish_logs (date, fish_type, location, size, memo)
    VALUES (${date}, ${fish_type}, ${location}, ${size}, ${memo})
    RETURNING *
  `;

  return result[0];
}
export async function POST(request) {
  return handler(await request.json());
}