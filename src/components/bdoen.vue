<script>

import { strategies } from '@/components/strategies';
import {execute_metastrategy}  from '@/components/executor';

export default
{
    name : "bdoen",
    el: "#app",
    data() 
    {
        return {
        lang: "en",
        strategies: strategies,
        state:
        {
            target: 20,
            metastrategy: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            maxattempts: 500,
            numiterations: 20
        },
        metastrategy_results : null
        }
    },
    methods: { 
        go: function go(ev) {
            console.log("Trying to execute metastrategy");
            this.metastrategy_results = execute_metastrategy(this.state);
        },
        format_consequences: function(x)
            {
                if (x["gain_fs"])
                    return "Gained " + x["gain_fs"] + " failstacks";
            }
    },
    computed:
        {
        pretty_log() {
            return this.metastrategy_results;
        }

        }
}

</script>

<template>
<div class="container">
<div class="row">
<div class="col">
<ul>
<li v-for="item in state.metastrategy" v-text="strategies[item].name.en"> </li>
</ul>
<button v-on:click="go($event)"> Go </button>
</div>
<div class="col" id="log">
    <div v-for="(x,i) in pretty_log" class="card"> 
        <div class="card-header" :id="`ladderrun_${i}`" data-bs-toggle="collapse" :data-bs-target="`#ladder_run_${i}_detail`">    New Attempt:  {{i+1}} </div>
        <div class="collapse hide" :id="`ladder_run_${i}_detail`" data-parent="#log">
        <div class="card-body">
        <div v-for="y in x" class="ladder_step"> 
            <div> {{y.result}} </div> <div> {{format_consequences(y.actions)}} </div>
            </div>
            </div>
            </div>
    </div>
</div>
</div>
</div>

</template>
<style scoped>
.ladder_run
{
}

.ladder_step
{

}

</style>
