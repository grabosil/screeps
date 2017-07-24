module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false
        } else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true
        }

        if (creep.memory.working == true) {
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION)
                             && s.energy < s.energyCapacity
            })

            if(structure == undefined) {
                structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_TOWER
                             && s.energy < s.energyCapacity
                })
            }
            
            if(structure == undefined) {
                structure = creep.room.storage
            }

            if (structure != undefined) {
                if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure)
                }
            }
        } else {

            let resources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: r => r.resourceType == RESOURCE_ENERGY
            })

            if(resources != undefined) {
                if (resources.room.name == creep.room.name) {
                    if (creep.pickup(resources) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(resources)
                    }
                } else {
                    this.goToContainer(creep)
                }
                
            } else {
                this.goToContainer(creep)
            }
            
        }
    },
    goToContainer: function(creep) {
        let containers = creep.pos.findInRange(FIND_STRUCTURES, 40, {
            filter: s => s.structureType == STRUCTURE_CONTAINER && 
                s.store[RESOURCE_ENERGY] > 0
        })

        let container = undefined

        if (containers != undefined) {
            containers.sort(function (a, b) {
                if (a.store[RESOURCE_ENERGY] > b.store[RESOURCE_ENERGY]) {
                    return 1;
                }
                    if (a.store[RESOURCE_ENERGY] < b.store[RESOURCE_ENERGY]) {
                        return -1;
                    }
                    return 0;
            })

            container = containers[0]
        }
        
        

        
        if(container == undefined) {
            container = creep.room.storage
        }
        if (container != undefined) {
            if (container.store[RESOURCE_ENERGY] > 0){
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container)
                }
            }         
        }
    },

};