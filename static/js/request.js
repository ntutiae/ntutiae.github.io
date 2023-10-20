export async function GET(url, dat = null, toJSON = false) {
  const res = await fetch(url, dat || {})
  return toJSON ? await res.json() : res
}
