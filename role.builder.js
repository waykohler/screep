var util = require('util');
var globals = require('globals');

module.exports = 
{
	spawn: function()
	{
		var upgraders = _.filter(Game.creeps,function(creep) { return creep.memory.role == "builder"; });
		if(upgraders.length < 4)
		{
			var ret = util.createCreepEx(Game.spawns['Spawn1'], 
						{
							parts:[MOVE,CARRY,CARRY,WORK], 
							partsInc:[CARRY,CARRY,WORK], 
							maxInc:3, 
							name:"Build", 
							memory:{role:"builder" } 
						});
			return false;
		}
		return true;
	},
	run: function(creep)
	{
	    var target = Game.getObjectById(Memory.buildTarget);
	    if(!target)
	    {
	        target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
	    }
	    if(!target)
	    {
	        console.log("Room search");
	        _.every(Game.rooms,function(room) 
	        {
                var find = room.find(FIND_MY_CONSTRUCTION_SITES);
                if(find.length)
                {
                    target = find[0];
                    return false;
                }
                return true;
	        });
	    }
	    if(!target)
	    {
	        return;
	    }
	    Memory.buildTarget = target.id;

		let ret = creep.build(target);

		if(ret == ERR_NOT_ENOUGH_RESOURCES || creep.carryCapacity > _.sum(creep.carry) * 2 )
		{
			globals.energyRequesters.push(creep);
			return;
		}
		if(ret == 0)
		{
			return;
		}
		if(ret == ERR_NOT_IN_RANGE)
		{
			creep.moveTo(target);
			return;
		}
	},

};