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
            maxattempts: 500
        }
        }
    },
    methods: { 
        go: function go(ev) {
            console.log("Trying to execute metastrategy");
            execute_metastrategy(this.state);
        }
    }
}

</script>

<template>
<ul>
<li v-for="item in state.metastrategy" v-text="strategies[item].name.en"> </li>
</ul>

<button v-on:click="go($event)"> Go </button>

</template>
<style scoped>
</style>
