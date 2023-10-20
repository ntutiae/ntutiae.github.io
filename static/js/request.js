export async function GET(url, dat = null, toJSON = false) {
    let res = await fetch(url, dat || {});
    return toJSON ? await res.json() : res;
}