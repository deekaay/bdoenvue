
import {strategies} from './strategies';
import {items} from './items.mjs';

export function acquireprerequisites(strat, inventory)
   {
   var needed = strategies[strat].requires;
   
   for (v in needed)
    {
        if (inventory[v] < needed[v]) // I do not have enough.
            {
            cost = items[v].acquire.silver;
            } 

    }

   }