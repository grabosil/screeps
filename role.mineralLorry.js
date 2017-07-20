module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false
        } else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true
        }

        if (creep.memory.working == true) {
            let structure = creep.room.storage
            if (structure != undefined) {
                if (creep.carry.H > 0) {
                    if (creep.transfer(structure, RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure)
                    }
                }
            }
        } else {
            let resources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: r => r.resourceType == RESOURCE_HYDROGEN
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
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER && 
                s.store[RESOURCE_HYDROGEN] > 0
        })
        
        if (container != undefined) {
            if (container.store[RESOURCE_HYDROGEN] > 0){
                if (creep.withdraw(container, RESOURCE_HYDROGEN) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container)
                }
            } 
        }
    }
};