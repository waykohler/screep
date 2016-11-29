var util = require('util');
var globals = require('globals');
var roleHarvester = require('role.harvester');
var roleCourier = require('role.courier');
var roleUpgrader = require('role.upgrader');
var roleScout = require('role.scout');
var roleBuilder = require('role.builder');

var BuildRoad = function(from, to, swampOnly)
{
	var built = true;
	var search = PathFinder.search(from.pos, { pos: to.pos, range:1 }, 
	{
		roomCallback: function(roomName) { return new PathFinder.CostMatrix; },
		plainCost:1,
		swampCost:1,
	});
	if( !search.incomplete )
	{
		search.path.every( function( pos )
		{
		    if(swampOnly && pos.lookFor(LOOK_TERRAIN) != 'swamp')
		    {
		        return true;
		    }
			if(_.filter(pos.lookFor(LOOK_STRUCTURES, function( obj ) { return obj.structureType == STRUCTURE_ROAD; } ) ).length )
			{
				return true;
			}

			built = false;

			if(_.filter(pos.lookFor(LOOK_CONSTRUCTION_SITES, function( obj ) { return obj.structureType == STRUCTURE_ROAD; } ) ).length )
			{
				return false;
			}
			pos.createConstructionSite(STRUCTURE_ROAD);
			return false;
		});
	}
	else
	{
	    console.log("Road build failed " + from.pos + " " + to.pos);
	}
	return built;
}

module.exports.loop = function () 
{
	for(name in Memory.creeps)
	{
		if(!(name in Game.creeps))
		{
			delete Memory.creeps[name];
		}
	}

    if(_.isEmpty(Game.creeps))
    {
        delete Memory.sources;
        delete Memory.rooms;
    }

	if(!Memory.sources)
	{
		Memory.sources = {};
	}

	globals.energy = [];

	_.forEach(Game.rooms, function( room ) 
	{
		room.memory.spawns = room.find(FIND_MY_SPAWNS);
		globals.energy = globals.energy.concat( room.find(FIND_DROPPED_ENERGY) );
		var sources = room.find(FIND_SOURCES);
		room.memory.sources = sources;
		_.forEach(sources, function(source)
		{
			if(!Memory.sources[source.id])
			{
			    console.log("New source");
				Memory.sources[source.id] = {
					pos: source.pos,
					id: source.id,
					creeps: {},
				};
			}
			Memory.sources[source.id].source = source;
		});
	});

    var spawned = false;
    var built = true;
    _.every(Memory.sources, function(source)
    {
        if(!BuildRoad(Game.spawns['Spawn1'],source.source, true))
        {
            built = false;
            return false;
        }
        return true;
    });
    _.every(Memory.sources, function(source)
    {
        if(built)
        {
            if(!BuildRoad(Game.spawns['Spawn1'], source.source, false))
            {
                built = false;
            }
        }
        if(!Game.creeps[source.creeps.harvester])
        {
            spawned = true;
		    source.creeps.harvester = roleHarvester.spawn(Game.spawns['Spawn1'], source);
		    return false;
        }
        else if(!Game.creeps[source.creeps.courier1])
        {
            spawned = true;
            source.creeps.courier1 = roleCourier.spawn(Game.spawns['Spawn1'], source);
		    return false;
        }
        else if(!Game.creeps[source.creeps.courier2])
        {
            spawned = true;
            source.creeps.courier2 = roleCourier.spawn(Game.spawns['Spawn1'], source);
		    return false;
        }
        return true;
    });

	_.forEach(Game.rooms, function( room ) 
	{
//		{
//			let constructions = room.find(FIND_CONSTRUCTION_SITES);
//			constructions.forEach(construction => {construction.remove();});
//		}
		var controller = room.controller;
		var spawns = room.find(FIND_MY_SPAWNS);
		var sources = room.find(FIND_SOURCES);

//		if(_.isEmpty( Game.creeps ))
//		{
//			spawns[0].createCreep([MOVE,WORK,CARRY]);
//		}

//		sources.every(source => 
//		{
//			if(!BuildRoad(source,spawns[0]))
//				return false;
//			if(!BuildRoad(spawns[0],source))
//				return false;
//			return true;
//		});
//
//		roleCourier.spawn(spawns[0]);
//		roleHarvester.spawn(spawns[0]);
	});
	let spawn = Game.spawns['Spawn1'];
    if(!spawned)
    {
        roleBuilder.spawn(spawn);
        roleScout.spawn(spawn);
		roleUpgrader.spawn(spawn);
    }

	globals.energyRequesters = [];

	_.forEach(Game.creeps, function( creep )
	{
		if(creep.memory.role == "harvester")
		{
			roleHarvester.run(creep);
		}
		else if(creep.memory.role == "upgrader")
		{
			roleUpgrader.run(creep);
		}
		else if(creep.memory.role == "scout")
		{
			roleScout.run(creep);
		}
		else if(creep.memory.role == "builder")
		{
			roleBuilder.run(creep);
		}
	});

//	console.log(globals.energyRequesters );

	_.forEach(Game.creeps, function( creep )
	{
		if(creep.memory.role == "courier")
		{
			roleCourier.run(creep);
		}
	});
/*
	_.forEach(Game.creeps, function( creep )
	{
		if(!creep.memory.working)
		{
			if(_.sum(creep.carry) == creep.carryCapacity)
			{
				creep.memory.working = true;
			}
			else
			{
				let source = creep.pos.findClosestByRange(FIND_SOURCES);
				let ret = creep.harvest(source);
				if(ret == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(source);
				}
				return;
			}
		}
		let jobs = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(!jobs.length)
			return;
		let job = jobs[0];
		let ret = creep.build(job);
		if(ret == ERR_NOT_ENOUGH_RESOURCES)
		{
			creep.memory.working = false;
			return;
		}
		if(ret == ERR_NOT_IN_RANGE)
		{
			creep.moveTo(job);
			return;
		}
	});
*/
}
