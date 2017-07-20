module.exports = {
    run: function(creep) {
        if (creep.room.name == creep.memory.target) {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN)
                })
                if (structure != undefined) {
                    if (creep.attack(structure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure)
                    }
                } else {
                    creep.suicide()
                }
        } else {
            var exit = creep.room.findExitTo(creep.memory.target)
            creep.moveTo(creep.pos.findClosestByRange(exit))
        }
    }
}