
export default  {
    name : { en : "Enhance Reblath +14" },
    requires : [ { "16001_14" : 1 }, {"10181": 1} ],
    minuse: 1,
    maxuse: 19,
    chance : function(x)
        {
        let v;
        if ( x > 120)
            v = .325;
        else
            v = .025 + .0025 * x;
        return { success: v, failure: 1 - v, break: 0};
        },
    success:
        { "lose" : [ "16001_14" ] ,
        "gain" : ["16001_15"] },
    failure:
        { "gain_fs" : 1 },
    break:
        {   }
};