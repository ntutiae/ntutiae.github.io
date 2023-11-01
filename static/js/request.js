export async function GET({ url, method = 'GET', dat = null, toJSON = false }) {
  if (!url) return null

  const res = await fetch(url, { ...dat, method })
  if (toJSON) {
    const result = await res.json()
    return result
  }
  return res
}

// eslint-disable-next-line prettier/prettier
export async function POST({ url, method = 'POST', dat = null, toJSON = false }) {
  if (!url) return null

  const res = await fetch(url, { ...dat, method })
  if (toJSON) {
    const result = await res.json()
    return result
  }
  return res
}
