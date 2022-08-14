
export function mergeactionsandcost(x,y)
{
    let z = { lose: { } };
    let qq = null;
    for (qq in x)
        z[qq] = x[qq];
    console.log(z);
    if (!y) return z;
    let k;
    for (k in y);
        {
        z["lose"][k] = (z["lose"][k] ?? 0) + y[k];
        }
    return z;
}