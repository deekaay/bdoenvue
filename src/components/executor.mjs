import {strategies} from "./strategies";

export function execute_metastrategy(state) {
    let meta_log = [];
    let strategy_res = null;
    let current_fs = 0;



    while (current_fs < state.target && meta_log.length <= state.maxattempts) // This means keep trying @ fs = 0;
    {
        console.log("Trying attempt: " + (meta_log.length + 1) );
        let ladder_log = [];
        let try_result = "Failure";
        while (try_result == "Failure" && current_fs < state.target) // This means we're within a ladder.
        {
            console.log("Current fs: " + current_fs + " trying strategy" + strategies[state.metastrategy[current_fs]].name.en)
            let res = trystrategy(state.metastrategy[current_fs], current_fs);
            ladder_log.push(null);
            ladder_log[current_fs] = res;
            try_result = res.result;


            console.log(try_result);
            if (try_result == "Failure")
                current_fs++;
            if (try_result == "Success")
                current_fs = 0;
            console.log(" Result " + try_result + " new fs: " + current_fs);

        }
        meta_log.push(ladder_log);

    }
    console.log("Success");

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