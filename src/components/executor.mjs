import {strategies} from "./strategies";

export function execute_metastrategy(state) {
    let meta_log = [];
    let strategy_res = null;
    let current_fs = 0;



    while (meta_log.length < state.numiterations) // This means keep trying @ fs = 0;
    {
        console.log("Trying attempt: " + (meta_log.length + 1) );
        let ladder_log = [];
        let try_result = "Failure";
        let cur_attempt = 1;
        while (current_fs < state.target && cur_attempt <= state.maxattempts) // This means we're within a ladder.
        {
            console.log("Current fs: " + current_fs + " trying strategy" + strategies[state.metastrategy[current_fs]].name.en)
            let res = trystrategy(state.metastrategy[current_fs], current_fs);
            ladder_log.push(res);
            try_result = res.result;

            if (try_result == "Failure")
                current_fs += ladder_log[current_fs].actions["gain_fs"];
            if (try_result == "Success")
                {
                current_fs = 0;
                cur_attempt++;
                }
        }
        meta_log.push(ladder_log);

    }
    return meta_log;
}
function trystrategy(strategy, fs) {
    console.log("Try Strategy: " + strategy + " fs: " + fs);
    let s = strategies[strategy];
    let prob = s.chance(fs);
    let r = Math.random();
    console.log("r: " + r);
    console.log(prob);

    let try_log = {};

    if (r <= prob.success) {
        try_log.result = 'Success';
        try_log.actions = s.success;
        // Success.
    }
    else if (r > prob.success && r <= (prob.success + prob.failure))
    {
        // Fail, no blowup.
        try_log.result = 'Failure';
        try_log.actions = s.failure;
    }
    else {
        //Other
    }
    return try_log;
}