export default  {
    name : { en : "Free Failstack (Adv Log)" },
    requires : { },
    minuse: 0,
    maxuse: 4,
    chance : function(x)
        {
        return { success: 0, failure: 1, break: 0};
        },
    success:
        { },
    failure:
    { "gain_fs" : 1 },
    break:
        {   },
    cost:
    { }
};