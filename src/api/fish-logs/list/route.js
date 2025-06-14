async function handler() {
  const logs = await sql`
    SELECT * FROM fish_logs 
    ORDER BY date DESC
  `;

  return { logs };
}
export async function POST(request) {
  return handler(await request.json());
}