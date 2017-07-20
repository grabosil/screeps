let roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repairer: require('role.repairer'),
    wallRepairer: require('role.wallRepairer'),
    longDistanceHarvester: require('role.longDistanceHarvester'),
    miner: require('role.miner'),
    lorry: require('role.lorry'),
    claimer: require('role.claimer'),
    shortAttacker: require('role.shortAttacker'),
    mineralLorry: require('role.mineralLorry')
}

Creep.prototype.runRole = function() {
    roles[this.memory.role].run(this);
}

Creep.prototype.getEnergy = function (useContainer, useSource) {
    let container
    if (useContainer) {
        container = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                            s.store[RESOURCE_ENERGY] > 0
        })
        if (container != undefined) {
            if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(container, {reusePath: 8});
            }
        }
    }
    if (container == undefined && useSource) {
        var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source, {reusePath: 8});
        }
    }
}