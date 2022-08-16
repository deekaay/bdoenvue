import { strategies } from "./strategies";
import { mergeactionsandcost } from '../util/mergeaction';
import { items } from './items.mjs';


export function execute_metastrategy(state) {
    let strategy_res = null;


    while (state.ladder_results.length < state.numiterations) // This loop represents a distinct ladder attempt.
    {
        console.log("Ladder attempt: " + (state.ladder_results.length + 1));
        let ladder_log = [];
        let ladder_inventory = { fs: 0 };
        let ladder_cost = 0;

        let cur_attempt = 1;
        let current_fs = 0;

        let ladder_attempt_cost = 0;

        while (current_fs < state.target && cur_attempt <= state.maxattempts) // This means we're within a ladder.
        {
            //console.log("Current fs: " + current_fs + " trying strategy" + strategies[state.metastrategy[current_fs]].name.en)
            let step_log = trystrategy(state.metastrategy[current_fs], ladder_inventory);
            let try_result = step_log.step_result;

/*
            if (try_result == "Failure")
                current_fs += res.actions["gain_fs"];
            if (try_result == "Success") {
                current_fs = 0;
                cur_attempt++;
                res.actions["lose_all_fs"] = 1;
            }
        */
        current_fs = ladder_inventory.fs;
        ladder_log.push(step_log);
        ladder_attempt_cost += step_log.step_cost;
        }
        

        state.ladder_results.push( { step_logs : ladder_log, inventory: ladder_inventory, cost : ladder_attempt_cost  });

    }
    console.log(state.ladder_results);

    state.total_cost = state.ladder_results.reduce((s, x) => s+x.cost, 0 );

}
function trystrategy(strategy, inventory) {
    //console.log("Try Strategy: " + strategy + " fs: " + inventory.fs);
    let s = strategies[strategy];
    let prob = s.chance(inventory.fs);
    let r = Math.random();
    //console.log("r: " + r);
    //console.log(prob);

    let step_action_log = [ ];
    let step_cost = 0;
    let incoming_fs = inventory.fs;

    let step_log = [ ];

    // do we have the prerequisite items?

    let needed = strategies[strategy].requires;

    let v;


    for (v in needed) {
        if (!inventory[v])
            inventory[v] = 0;

        //console.log('I need: ' + needed[v] + ' of ' + v);
        //console.log('I have: ' + inventory[v] + ' of ' + v);
        for (let j = 1; j <= (needed[v] - inventory[v]); j++) {
            //console.log(v);
            //console.log(items[v]);
            //console.log(items);
            step_cost += items[v].acquire.silver;
            step_action_log.push({ action: items[v].acquire.action, cost: items[v].acquire.silver, item: v }); // Purchase stuff.
            //console.log('Acquired: ' + items[v]);
            inventory[v]++;
        }
    }

    let step_result = "";

    if (r <= prob.success) {
        // Success.
        step_result = 'Success';
        step_action_log.push(s.success);
        inventory.fs = 0;
        let qq;
        for (qq in strategies[strategy].success.gain)
            {
                if (!inventory[qq] )
                    inventory[qq] = 0
            inventory[qq] += strategies[strategy].success.gain[qq];
            }
        for (qq in strategies[strategy].success.lose)
            {
                if (!inventory[qq] )
                    inventory[qq] = 0
            inventory[qq] -= strategies[strategy].success.lose[qq];
            }

    }
    else if (r > prob.success && r <= (prob.success + prob.failure)) {
        // Fail, no blowup.
        step_result = 'Failure';
        step_action_log.push(s.failure);
        inventory.fs += s.failure.gain_fs;
        //console.log('gain fs:' + s.failure.gain_fs);
        //console.log('New fs:' + inventory.fs);
    }
    else {
        step_result = "Other";
        //Other
    }
    let vv;
    for (vv in strategies[strategy].cost)
        {
        if (!inventory[vv])
            inventory[vv] = 0;
        inventory[vv] -= strategies[strategy].cost[vv];
        }

    //console.log("zz:" + JSON.stringify({ step_log : step_action_log, step_cost: step_cost, step_result : step_result }));
    return { step_log : step_action_log, step_cost: step_cost, step_result: step_result, incoming_fs : incoming_fs, result_fs : inventory.fs };
}