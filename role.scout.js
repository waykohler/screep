var util = require('util');
var globals = require('globals');

module.exports = 
{
    spawn: function(spawn)
    {
        if(_.filter(Game.creeps,function(creep){return creep.memory.role == "scout";}).length)
            return;
		var ret = util.createCreepEx(spawn, 
					{
						parts:[MOVE], 
						maxInc:0, 
						name:"Scout", 
						memory:{role:"scout" } 
					});
		return ret;
    },
    run: function(creep)
    {
        var keys = _.keys(Game.flags);
        if(keys.length == 0)
            return;
        var target = creep.memory.target;
        var index = keys.indexOf(target);
        if(index == -1)
        {
            index = 0;
            target = keys[index];
            creep.memory.target = target;
        }
        var obj = Game.flags[target];
        var ret = creep.moveTo(obj);
        if(obj.pos.roomName == creep.pos.roomName && util.distSq(obj.pos,creep.pos) <= 1)
        {
            console.log(obj.pos.room);
            creep.memory.target = keys[(index+1)%keys.length];
            console.log(creep.memory.target);
        }
    }
};