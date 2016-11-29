var util = require('util');
var globals = require('globals');

module.exports = 
{
	spawn: function(spawn, source)
	{
		var ret = util.createCreepEx(spawn, 
					{
						parts:[MOVE,CARRY,MOVE,CARRY,MOVE,CARRY], 
						partsInc:[MOVE,CARRY], 
						maxInc:4, 
						name:"Courier", 
						memory:{role:"courier", source:source.id } 
					});
		return ret;
	},
	run: function(creep)
	{

		if(creep.memory.full)
		{
			var spawn = Game.spawns['Spawn1'];
			if(spawn.room.name == creep.room.name && spawn.energyCapacity != spawn.energy)
			{
				creep.memory.target = spawn;
				var ret = creep.transfer(spawn,RESOURCE_ENERGY);
				if(ret == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(spawn);
					return;
				}
			}
			while(globals.energyRequesters.length && _.sum(creep.carry))
			{
				globals.energyRequesters = util.sortByDistanceSticky(globals.energyRequesters,creep.pos, creep.memory.target);
				var dest = globals.energyRequesters.pop();
				//var dest = globals.energyRequesters[globals.energyRequesters.length - 1];
				creep.memory.target = dest.pos;
				var ret = creep.transfer(dest,RESOURCE_ENERGY);
				if(ret == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(dest);
					return;
				}
			}
			if(spawn.energyCapacity != spawn.energy)
			{
				creep.memory.target = spawn;
				var ret = creep.transfer(spawn,RESOURCE_ENERGY);
				if(ret == ERR_NOT_IN_RANGE)
				{
					creep.moveTo(spawn);
					return;
				}
			}
			creep.memory.full = false;
		}
		
		var source = Memory.sources[creep.memory.source];
        var harvester = Game.creeps[source.creeps.harvester];
        if(!harvester)
            return;
//        var energy = harvester.pos.findClosestByRange(FIND_DROPPED_ENERGY);
        var energy = harvester.pos.lookFor(LOOK_ENERGY);
        
        if(energy.length == 0)
            return;
        energy = energy[0];
		var ret = creep.pickup(energy);

		if(ret == ERR_NOT_IN_RANGE)
		{
			creep.moveTo(energy);
			return;
		}
		if(ret == ERR_FULL)
		{
			creep.memory.full = true;
			return;
		}
	},
};
