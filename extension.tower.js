StructureTower.prototype.defend = function() {
    var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target != undefined) {
        this.attack(target);
    } else {
        var structure = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < (s.hitsMax*0.2) && 
            s.structureType != STRUCTURE_WALL && 
            s.structureType != STRUCTURE_RAMPART
        })

        if (structure != undefined) {
            this.repair(structure)
        } else {
            var walls = this.room.find(FIND_STRUCTURES, {
                filter: (s) => (
                    s.structureType == STRUCTURE_WALL || 
                    s.structureType == STRUCTURE_RAMPART)
            })

            var target = undefined
            for (let percentage = 0.0001; percentage <= 0.001; percentage = percentage + 0.0001){
                for (let wall of walls) {
                    if (wall.hits / wall.hitsMax < percentage) {
                        target = wall
                        break
                    }
                }
                if (target != undefined) {
                    break
                }
            }

            if (target != undefined) {
                this.repair(target)
            }
        }
    }

    
}