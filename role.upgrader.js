var util = require('util');
var globals = require('globals');

module.exports = 
{
	spawn: function()
	{
		var upgraders = _.filter(Game.creeps,function(creep) { return creep.memory.role == "upgrader"; });
		if(upgraders.length < 4)
		{
			var ret = util.createCreepEx(Game.spawns['Spawn1'], 
						{
							parts:[MOVE,CARRY,CARRY,WORK], 
							partsInc:[CARRY,CARRY,WORK], 
							maxInc:3, 
							name:"Up", 
							memory:{role:"upgrader" } 
						});
			return false;
		}
		return true;
	},
	run: function(creep)
	{
		let ret = creep.upgradeController(creep.room.controller);
//		console.log(ret);
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
			creep.moveTo(creep.room.controller);
			return;
		}
	},

};