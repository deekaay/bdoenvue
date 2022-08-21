<script>

import { strategies } from '@/components/strategies';
import { execute_metastrategy } from '@/components/executor';

export default
    {
        name: "bdoen",
        el: "#app",
        data() {
            return {
                lang: "en",
                strategies: strategies,
                strategies_by_level: [],
                state:
                {
                    target: 20,
                    metastrategy: [2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    maxattempts: 500,
                    numiterations: 20,
                    total_cost: 0,
                    ladder_results: []
                }
            }
        },
        methods: {
            go: function go(ev) {
                console.log("Trying to execute metastrategy");
                execute_metastrategy(this.state);
            },
            format_consequences: function (x) {
                let ret = "";
                for (let q in x["lose"])
                    ret += "Lost " + x["lose"][q] + " " + q;
                for (let q in x["gain"])
                    ret += "Gained " + x["gain"][q] + " " + q;
                if (x["gain_fs"])
                    ret += "Gained " + x["gain_fs"] + " failstacks";
                if (x["lose_all_fs"])
                    ret += "Lost all failstacks.";
                return ret;
            }
        },
        computed:
        {
            pretty_log() {
                return "";
            }

        },
        mounted() {
            let i;
            for (i = 0; i < this.state.target; i++) {
                let z = [];
                for (let j in this.strategies) {
                    if (this.strategies[j].minuse <= i && this.strategies[j].maxuse >= i) {
                        z.push(j);
                    }
                    console.log(z);
                }
                this.strategies_by_level.push(z);
            }
            console.log(this.strategies_by_level);
        }
    }

</script>

<template>
    <div class="container">
        <div class="row">{{ state.total_cost }} {{ state.numiterations }} {{ state.total_cost / state.numiterations }}
        </div>
        <div class="row">
            <div class="col">
                <div class="row" v-for="(r, i) in state.metastrategy">
                    <div class="fs-label"> FS: {{i}} </div>
                    <select v-model="state.metastrategy[i]">
                        <option v-for="k in strategies_by_level[i]" :value="k" :selected="k == state.metastrategy[i]"> {{ strategies[k].name.en }} </option>
                    </select>
                </div>
                <button v-on:click="go($event)"> Go </button>
            </div>
            <div class="col" id="log">
                <div v-for="(x, i) in state.ladder_results" class="card">
                    <!-- For each ladder run.  -->
                    <div class="card-header ladder-run" :id="`ladderrun_${i}`" data-bs-toggle="collapse"
                        :data-bs-target="`#ladder_run_${i}_detail`"> New Attempt: {{ i + 1 }} Cost: {{ x.cost }} </div>
                    <div class="collapse hide" :id="`ladder_run_${i}_detail`" data-parent="#log">
                        <div class="card-body">
                            <div v-for="y in x.step_logs" class="ladder-step">
                                <!-- For each log item in the step log -->
                                <div>Starting FS {{ y.incoming_fs }} </div>
                                <div v-for="z in y.step_log" class="ladder-step-det"> {{ z }} </div>
                                <div> {{ y.step_result }} </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped>
.ladder-run {}

.ladder-step {}

i.fs-label { }

</style>
