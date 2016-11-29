let	sortByDistance = function(array, pos)
	{
		return array.sort(function(a,b) 
		{
			var da = {x:a.x - pos.x, y:a.y - pos.y};
			var db = {x:b.x - pos.x, y:b.y - pos.y};
			return (da.x*da.x + da.y*da.y) - (db.x*db.x + db.y*db.y);
		});
	};
let sq = function(v) { return v * v; };

module.exports = {
	createCreepEx: function(spawn, args)
	{
		let parts = args.parts;
		let partsInc = args.partsInc || parts;
		let name = args.name;
		let maxInc = args.maxInc || 0;
		let memory = args.memory || {};

		for(var i=0;i<maxInc;i++)
		{
			if(spawn.canCreateCreep(parts.concat(partsInc)) != 0)
			{
				break;
			}
			parts = parts.concat(partsInc);
		}

		if(name)
		{
			let num = 1;
			name = name + " ";
			while((name + num) in Game.creeps)
			{
				num++;
			}
			name = name + num;
		}

		return spawn.createCreep( parts, name, memory );
	},
	sortByDistance: sortByDistance,
	sortByDistanceSticky: function(array, pos, sticky)
	{
		if(sticky)
		{
			for(var i=0;i<array.length;i++)
			{
				var p = array[i];
				if(p.x == sticky.x && p.y == sticky.y)
				{
					array[i] = array[array.length-1];
					array[array.length-1] = p;
					return array;
				}
			}
		}
		return sortByDistance(array,pos);
	},
	sq: function(v) { return v*v; },
	distSq: function(a,b) 
	{
	    return sq(a.x-b.x)+sq(a.y-b.y);   
	},
};