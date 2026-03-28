export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL ?? 'http://localhost:5173',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
