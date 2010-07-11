(function(){
    
this.parseSubPaths=function(pathData)
{
    var x=0, y=0, idx = 0;
    var data = pathData.split(/[ ,]/);
    var len = data.length;
    
    var paths=[];
    var points = [];
    var lastCmd = "L";
    
    while (idx < len)
    {
        var cmd = data[idx++];
     
        if (cmd < "A")
        {
            cmd = lastCmd;
            if (cmd == "M")
            {
                cmd = "L";
            }
            if (cmd == "m")
            {
                cmd = "l";
            }
            idx--;
        }
        else
        {
            lastCmd = cmd;
        }
        
        var absolute = false;
        if (cmd <= "a")
        {
            absolute = true;
            cmd = String.fromCharCode(cmd.charCodeAt(0) + 32);
        }
        
        switch(cmd)
        {
            case "m":
                points = [];
                x=0;
                y=0;
            case "l":
                if (absolute)
                {
                    x = +data[idx++];
                    y = +data[idx++];
                }
                else
                {
                    x += +data[idx++];
                    y += +data[idx++];
                }
                points.push(new Vector2D(x,y));
                break;
            case "z":
                paths.push(points);
                points = [];
                x=0;
                y=0;
                break;
        }
    
    }
    
    return paths;
};

this.findClosestPointInCandidates = function(candidates, point)
{
    //console.debug("candidates = %o, len = %s", candidates, candidates.length);
    var minDistance = Infinity, bestCandidate, bestClosest, candidate;
    for ( var i = 0, len = candidates.length; i < len; i++)
    {
        candidate = candidates[i];
        if (candidate && candidate.type === "line")
        {
//            new Marker(candidate.pt0.x, candidate.pt0.y);
//            new Marker(candidate.pt1.x, candidate.pt1.y);
            var closest = closestPointOnLineSegment(point, candidate.pt0, candidate.pt1);
            
            var distance = closest.substract(point).length();
            if (distance < minDistance)
            {
                minDistance = distance;
                bestCandidate = candidate;
                bestClosest = closest;
            }
        }
    }
    
    return {closest: closest, obj: bestCandidate, distance: minDistance};  
};

var _indexOf = Array.prototype.indexOf;

this.removeFromArray = function(array,obj)
{
    var idx = -1;
    if (_indexOf)
    {
        idx = _indexOf.call(array,obj);
    }
    else
    {
        for (var i = 0, len = array.length; i < len ; i++)
        {
            if (array[i] === obj)
            {
                idx = i;
                break;
            }
        }
    }
    
    if (idx >= 0)
    {
        array.splice(idx,1);
    }
};

})();