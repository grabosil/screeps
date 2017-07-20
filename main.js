require('extension.spawn');
require('extension.creep');
require('extension.tower');

module.exports.loop = function () {
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            console.log("RIP", name)
            delete Memory.creeps[name]
        }
    }

    for (let name in Game.creeps) {
        Game.creeps[name].runRole()
    }

    let towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER)
    for (let tower of towers) {
        tower.defend()
    }
    
    for (let spawnName in Game.spawns) {
        Game.spawns[spawnName].createNewCreeper()
    }   
}