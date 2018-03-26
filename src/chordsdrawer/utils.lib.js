var ChordsDrawerUtils = {};

ChordsDrawerUtils.create = {};

ChordsDrawerUtils.create.position =
function ( x ,y )
{
    x=x||0;
    y=y||0;
    return {'x':x,'y':y}
};

ChordsDrawerUtils.create.size =
function ( w ,h )
{
    w=w||0;
    h=h||0;
    return {'w':w,'h':h}
};

ChordsDrawerUtils.create.box =
function ( x ,y ,w ,h )
{
    return {'position':ChordsDrawerUtils.create.position(x,y),'size':ChordsDrawerUtils.create.size(w,h)}
};

ChordsDrawerUtils.create.line =
function ( x0 ,y0 ,x1 ,y1 )
{
    return {'beg':ChordsDrawerUtils.create.position(x0,y0),'end':ChordsDrawerUtils.create.position(x1,y1)}
};

ChordsDrawerUtils.create.font =
function ( size ,family ,baseline ,align ,color ,weight )
{
    size=size||10;
    family=family||'Courrier';
    baseline=baseline||'top';
    align=align||'center';
    color=color||'#000000';
    weight=weight||'';
    return {'size':size,'family':family,'baseline':baseline,'align':align,'color':color,'weight':weight}
};

if ( typeof String.trim === 'undefined' ) { String.prototype.trim = function (){ return this.replace(/^\s+|\s+$/gm,''); }; }