module.exports = {
    run: function(creep) {
        if (creep.room.name == creep.memory.target) {
           let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
               filter: (c) => _.filter(c.body, (part) => part.type == "attack" || part.type == "ranged_attack").length > 0
           })

           if (target) {
               let errorcode = creep.attack(target)
               if (errorcode == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }   
           }
            if( target == undefined) {
                target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: c =>  c.hits < c.hitsMax
                })
            }

            
            if(target) {
                let errorcode = creep.heal(target)
                if(errorcode == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                if (errorcode == ERR_NO_BODYPART) {
                    this.attackStructure(creep)
                }
            } else {
                this.attackStructure(creep)
            }
            
        } else {
            var exit = creep.room.findExitTo(creep.memory.target)
            creep.moveTo(creep.pos.findClosestByRange(exit))
        }
    },
    attackStructure: function(creep) {
        var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN
                            || s.structureType == STRUCTURE_EXTENSION
                            || s.structureType == STRUCTURE_TOWER)
        })

        if (structure != undefined) {
            if (creep.attack(structure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure)
            }
        } else {
            structure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: (s) => s.structureType != STRUCTURE_ROAD &&
                    s.structureType != STRUCTURE_CONTROLLER
            })
                if (structure != undefined) {
                if (creep.attack(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure)
                }
                } else {
                creep.suicide()
                }
        }
    }
}