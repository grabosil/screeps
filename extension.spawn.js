const listOfRoles = ['harvester', 'lorry', 'claimer', 'upgrader', 'repairer', 'builder', 'wallRepairer']

StructureSpawn.prototype.createNewCreeper = function() {
    const room = this.room;
    const creepsInRoom = room.find(FIND_MY_CREEPS);
    let numberOfCreeps = {}
    for (let role of listOfRoles) {
        numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role)
    }

    if (!this.memory.minCreeps) {
        this.memory.minCreeps = {
            harvester: 0,
            lorry: 1,
            claimer: 0,
            upgrader: 1,
            repairer: 1,
            builder: 1,
            wallRepairer: 0
        }
    }

    if (!this.memory.longDistanceHarvesters) {
        this.memory.longDistanceHarvesters = {}
    }

    const fullEnergy = room.energyCapacityAvailable
    let name = undefined;
    if(Game.time % 5 == 0) {
        console.log('Energy in room ' + this.name + ': ' + room.energyAvailable + '/' +fullEnergy);
    }

    if (numberOfCreeps['harvester'] == 0 && numberOfCreeps['lorry'] == 0) {
        if (numberOfCreeps['miner'] > 0 ||
            (room.storage != undefined && room.storage.store[RESOURCE_ENERGY] >= 150 + 550)) {
            name = this.createLorry(150);
        } else {
            name = this.createBigCreep(room.energyAvailable, 'harvester')
        }
    } else {
        let sources = room.find(FIND_SOURCES)
        for (let source of sources) {
            if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id) && room.energyAvailable >= 550) {
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER
                })

                if (containers.length > 0) {
                    name = this.createMiner(source.id)
                }
            }
        }

        const minerals = room.find(FIND_MINERALS)
        const extractor = room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_EXTRACTOR
        })
        const mineral = minerals[0]
        if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == mineral.id) && room.energyAvailable >= 550 && extractor.length > 0) {
                let containers = mineral.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER
                })

                if (containers.length > 0) {
                    name = this.createMiner(mineral.id)
                }
            }
    }

    if (name == undefined) {
        let towers = room.find(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_TOWER
        })
        for (let role of listOfRoles) {
            if (role == 'claimer' && this.memory.claimRoom != undefined) {
                name = this.createClaimer(this.memory.claimRoom)
                    if (name != undefined && _.isString(name)) {
                        delete this.memory.claimRoom
                    }
            } else if (role == 'repairer' || role == 'wallRepairer') {
                if (towers.length == 0 && numberOfCreeps[role] < this.memory.minCreeps[role]) {
                    name = this.createBigCreep(room.energyAvailable > 1800 ? 1800 : room.energyAvailable, role)
                }
            }  else if (role == 'builder') { 
                let constructions = room.find(FIND_CONSTRUCTION_SITES)
                if (constructions.length > 0 && numberOfCreeps[role] < this.memory.minCreeps[role]) {
                    name = this.createBigCreep(room.energyAvailable > 1800 ? 1800 : room.energyAvailable, role)
                }
            } else if (numberOfCreeps[role] < this.memory.minCreeps[role]) {
                if (role == 'lorry') {
                    name = this.createLorry(150);
                } else {
                    name = this.createBigCreep(room.energyAvailable > 1800 ? 1800 : room.energyAvailable, role)
                }
            } 
        }

        let numberOfLongDistanceHarvesters = {}
    
        if (name == undefined) {
            for (let roomName in this.memory.longDistanceHarvesters) {
                numberOfLongDistanceHarvesters[roomName] = _.sum(Game.creeps, (c) => c.memory.role == 'longDistanceHarvester' && c.memory.target == roomName)
                if (numberOfLongDistanceHarvesters[roomName] <  this.memory.longDistanceHarvesters[roomName]) {
                    if (this.memory.longDistanceSource == undefined) {
                        this.memory.longDistanceSource = 0
                    }
                    name = this.createLongDistanceHarvester(fullEnergy, 2, room.name, roomName, this.memory.longDistanceSource)
                    if(this.memory.longDistanceSource == 0) {
                        this.memory.longDistanceSource = 1
                    } else {
                        this.memory.longDistanceSource = 0
                    }
                }
            }
        }

        if(name != undefined && _.isString(name)) {
            console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")")
            for(let role of listOfRoles) {
                console.log(role + ": " + numberOfCreeps[role])
            }
            for (let roomName in numberOfLongDistanceHarvesters) {
                console.log("LongDistanceHarvester" + roomName + ": " + numberOfLongDistanceHarvesters[roomName])
            }
        }
    }
}

StructureSpawn.prototype.createBigCreep =
    function(energy, roleName) {
        var numberOfParts = Math.floor(energy / 200);
        var body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
        return this.createCreep(body, undefined, { role: roleName, working: false });
    };
    
    StructureSpawn.prototype.createLongDistanceHarvester =
    function (energy, numberOfWorkParts, home, target, sourceIndex) {
        var body = [];
        for (let i = 0; i < numberOfWorkParts; i++) {
            body.push(WORK);
        }

        energy -= 150 * numberOfWorkParts;

        var numberOfParts = Math.floor(energy / 100);
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
            body.push(MOVE);
        }

        return this.createCreep(body, undefined, {
            role: 'longDistanceHarvester',
            home: home,
            target: target,
            sourceIndex: sourceIndex,
            working: false
        });
    };

    StructureSpawn.prototype.createMiner =
    function (sourceId) {
        return this.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined,
                                { role: 'miner', sourceId: sourceId });
    };

    StructureSpawn.prototype.createLorry =
    function (energy) {
        var numberOfParts = Math.floor(energy / 150);
        var body = [];
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        return this.createCreep(body, undefined, { role: 'lorry', working: false });
    };

    StructureSpawn.prototype.createClaimer =
    function (target) {
        return this.createCreep([CLAIM, MOVE], undefined, { role: 'claimer', target: target })
    }

    StructureSpawn.prototype.createShortAttacker =
    function (target) {
        return this.createCreep([ATTACK,ATTACK, MOVE,MOVE,MOVE,MOVE], undefined, { role: 'shortAttacker', target: target })
    }
