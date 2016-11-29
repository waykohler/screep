var util = require('util');
module.exports = {
	spawn: function(spawn,source)
	{
		var ret = util.createCreepEx(Game.spawns['Spawn1'], 
					{
						parts:[MOVE,WORK,WORK], 
						partsInc:[WORK], 
						maxInc:3, 
						name:"Harv", 
						memory:{role:"harvester", source:source.id } 
					});
		return ret;
	},
	run: function(creep)
	{
//	    if(Memory.sources[creep.memory.source].creeps.harvester != creep.name)
//	    {
//	        creep.suicide();
//	        return;
//	    }
		let source = Game.getObjectById(creep.memory.source);
		if(!source)
		{
		    console.log(Memory.sources[creep.memory.source].pos);
		    let ret = creep.moveTo(Memory.sources[creep.memory.source].pos);
		    console.log(ret);
		    return;
		}
		let ret = creep.harvest(source);
		if(ret == 0)
		{
		    if(source.storage)
		    {
		        var storage = Game.getObjectById(source.storage);
		        creep.transfer(storage,RESOURCE_ENERGY);
		    }
		    else
		    {
			    creep.drop(RESOURCE_ENERGY);
		    }
			return;
		}
		if(ret == ERR_NOT_IN_RANGE)
		{
			creep.moveTo(source);
			return;
		}
	},
};