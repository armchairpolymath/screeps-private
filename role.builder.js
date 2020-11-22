var roleUpgrader = require('role.upgrader');

module.exports = {
    // a function to run the logic for this role
    /** @param {Creep} creep */
    run: function (creep) {
        // creep.pos.createConstructionSite(STRUCTURE_ROAD);
        // if target is defined and creep is not in target room
        if (creep.memory.target != undefined && creep.room.name != creep.memory.target) {
            // find exit to target room
            // var exit = creep.room.findExitTo(creep.memory.target);
            // move to exit
            creep.moveTo(Game.rooms[creep.memory.target].controller);
           // creep.moveTo(creep.pos.findClosestByRange(exit));
            console.log(creep + ' ' + creep.pos + ' ' + creep.memory.target);
            // return the function to not do anything else
            return;
        }

        // if creep is trying to complete a constructionSite but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
            creep.memory.roleChange = false;
        }

        // if creep is supposed to complete a constructionSite
        if (creep.memory.working == true) {
            // find closest constructionSite
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            // if one is found
            if (constructionSite != undefined) {
                // try to build, if the constructionSite is not in range
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    // move towards the constructionSite
                    // creep.pos.createConstructionSite(STRUCTURE_ROAD);
                    creep.moveTo(constructionSite,{visualizePathStyle:{
                        fill: 'transparent',
                        stroke: '#0000FF', //Blue for building
                        lineStyle: 'dashed',
                        strokeWidth: .08,
                        opacity: .15    
                    }});
                }
            }
            // if no constructionSite is found
            else {
                // go upgrading the controller
                creep.memory.roleChange = true;
                roleUpgrader.run(creep);
            }
        }
        // if creep is supposed to get energy
        else {
            // creep.pos.createConstructionSite(STRUCTURE_ROAD);
            creep.getEnergy(true, false, true); //container, source, dropped
        }
    }
};