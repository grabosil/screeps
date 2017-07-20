module.exports = {
    run: function(creep) {
        creep.say('long')
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true
        }

        if ((creep.memory.working == false && creep.room.name != creep.memory.target && creep.ticksToLive <= 150) 
        || (creep.room.name == creep.memory.target && creep.ticksToLive <= 50)){
            creep.suicide()
            console.log("LongDistance setzte sich zur Ruhe")
        }

        if (creep.memory.working == true) {
            if (creep.room.name == creep.memory.home) {
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                                 || s.structureType == STRUCTURE_EXTENSION
                                 || s.structureType == STRUCTURE_TOWER)
                                 && s.energy < s.energyCapacity
                })
                
                if (structure == undefined) {
                    structure = creep.room.storage
                }   

                if (structure != undefined) {
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure, {reusePath: 10})
                    }
                }
            } else {
                var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN
                                 || s.structureType == STRUCTURE_EXTENSION
                                 || s.structureType == STRUCTURE_TOWER)
                                 && s.energy < s.energyCapacity
                })
                
                if (structure != undefined) {
                    if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure, {reusePath: 10})
                    }
                }

                if (structure == undefined) {
                    var exit = creep.room.findExitTo(creep.memory.home)
                    creep.moveTo(creep.pos.findClosestByRange(exit), {reusePath: 10})
                }   
                
            }
        } else {
            if (creep.room.name == creep.memory.target) {
                let resources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                    filter: r => r.resourceType == RESOURCE_ENERGY
                })

                if(resources != undefined) {
                    if (resources.room.name == creep.room.name) {
                        if (creep.pickup(resources) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(resources)
                        }
                    } else {
                        this.goToSource(creep)
                    }
                    
                } else {
                    this.goToSource(creep)
                }
                
            } else {
                var exit = creep.room.findExitTo(creep.memory.target)
                creep.moveTo(creep.pos.findClosestByRange(exit), {reusePath: 20})
            }
        }
    },
    goToSource: function(creep) {
        var source = creep.room.find(FIND_SOURCES)[creep.memory.sourceIndex]
                
        if (source == undefined) {
            source = creep.room.storage
        }
    
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {reusePath: 12})
        }
    }
};