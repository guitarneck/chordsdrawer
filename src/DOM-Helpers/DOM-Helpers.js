function DOMHelper () {}

function isHTMLElement (e) { return e instanceof HTMLElement }
function isElement (e) { return e instanceof Element }
function isNode (n) { return n instanceof Node }

DOMHelper.prototype.generateId =
function
DOMHelper_generateId ()
{
    return 'DOMHelper' + Math.round(Math.random() * 1000000)
}

DOMHelper.prototype.byId =
function
DOMHelper_byId ( id ,parent )
{
    return document.getElementById( id );
}

DOMHelper.prototype.element =
function
DOMHelper_element ( type ,attributesList )
{
    attributesList = attributesList || {};
    if ( typeof attributesList.id === 'undefined' ) attributesList.id = DOMHelper.generateId();
    return DOMHelper.attachAttributesList(document.createElement( type ),attributesList);
}

DOMHelper.prototype.attachAttributesList =
function
DOMHelper_attachAttributesList ( node ,attributesList )
{
    for ( var attr in attributesList )
    {
        node.setAttribute(attr ,attributesList[attr]);
    }
    return node;
}

DOMHelper.prototype.attachStyleList =
function
DOMHelper_attachStyleList ( node ,styleList )
{
    var list = [];
    
    var oldStyle = node.getAttribute('style');
    if( oldStyle ) list.push(oldStyle);

    for ( var attr in styleList )
    {
        list.push(attr+':'+styleList[attr]);
    }

    node.setAttribute('style' ,list.join(';'));
    
    return node;
}

DOMHelper.prototype.append =
function
DOMHelper_append ( node ,nodes )
{
    for ( var i=1, l=arguments.length ; i<l ; i++ )
    {
        node.appendChild( arguments[i] );
    }
    return node;
}

DOMHelper.prototype.before =
function
DOMHelper_before ( node ,nodes )
{
    var parent = node.parentNode;
    for ( var i=1, l=arguments.length ; i<l ; i++ )
    {
        parent.insertBefore( arguments[i] ,node );
    }
    return parent;
}

DOMHelper.prototype.replace =
function
DOMHelper_replace ( parent ,oldNode ,newNodes )
{
    if( oldNode !== null )
        DOMHelper.before( oldNode, newNodes );
    else
        DOMHelper.append( parent ,newNodes );

    if( oldNode !== null ) DOMHelper.remove( oldNode );
    
    return parent;
}

DOMHelper.prototype.remove =
function
DOMHelper_remove ( child )
{
    var parent = child.parentNode;
    parent.removeChild(child);
    return parent;
}

DOMHelper.prototype.removeAllChildren =
function
DOMHelper_removeAllChildren ( parent )
{
    while (parent.firstChild) parent.removeChild(parent.firstChild);
    return parent;
}

DOMHelper.prototype.class =
function
DOMHelper_class ( node ,classes )
{
    node.setAttribute('class' ,classes);
    return node;
}

DOMHelper.prototype.nbsp =
function
DOMHelper_nbsp ()
{
    return document.createTextNode(' ');
}

DOMHelper.prototype.br =
function
DOMHelper_br ()
{
    return document.createElement('BR');
}

DOMHelper.prototype.hr =
function
DOMHelper_hr ()
{
    return document.createElement('HR');
}

DOMHelper.prototype.fieldset =
function
DOMHelper_fieldset ( legend )
{
    var Ø = document.createElement('FIELDSET');
    
    if ( legend )
    {
        Ø.appendChild(document.createElement('LEGEND'));
        Ø.firstChild.appendChild( isHTMLElement(legend) ? legend : document.createTextNode(legend) );
    }
    
    return Ø;
}

DOMHelper.prototype.label =
function
DOMHelper_label ( text ,forid )
{
    var Ø = document.createElement('LABEL');
    Ø.setAttribute('for' ,forid);
    Ø.appendChild( isHTMLElement(text) ? text : document.createTextNode(text) );
    return Ø;
}

DOMHelper.prototype.checkbox =
function
DOMHelper_checkbox ( name ,value ,id ,checked ,onclick )
{
    id = id || this.generateId();
    checked = checked || false;

    var Ø = document.createElement('INPUT');
    Ø.setAttribute('type'  ,'checkbox');
    Ø.setAttribute('id'    ,id);
    Ø.setAttribute('name'  ,name);
    Ø.setAttribute('value' ,value);
    Ø.checked = checked;
    Ø.onclick = onclick;
    return Ø;
}

DOMHelper.prototype.radio =
function
DOMHelper_radio ( name ,value ,id ,checked )
{
    id = id || this.generateId();
    checked = checked || false;

    var Ø = document.createElement('INPUT');
    Ø.setAttribute('type'  ,'radio');
    Ø.setAttribute('id'    ,id);
    Ø.setAttribute('name'  ,name);
    Ø.setAttribute('value' ,value);
    Ø.checked = checked;
    return Ø;
}

DOMHelper.prototype.button =
function
DOMHelper_button ( name ,onclick ,id )
{
    id = id || this.generateId();

    var Ø = document.createElement('INPUT');
    Ø.setAttribute('type'  ,'button');
    Ø.setAttribute('value' ,name);
    Ø.setAttribute('name'  ,name);
    Ø.setAttribute('id'    ,id);
    
    Ø.onclick = onclick;
    
    return Ø;
}

DOMHelper.prototype.button2 =
function
DOMHelper_button ( name ,onclick ,id )
{
    id = id || this.generateId();

    var Ø = document.createElement('BUTTON');
    Ø.setAttribute('type'  ,'button');
    Ø.setAttribute('value' ,name);
    Ø.setAttribute('id'    ,id);
    
    Ø.onclick = onclick;

    Ø.appendChild(document.createTextNode(name));
    
    return Ø;
}

DOMHelper.prototype.reset =
function
DOMHelper_reset ( value ,onclick ,id )
{
    id = id || this.generateId();

    var Ø = document.createElement('INPUT');
    Ø.setAttribute('type'  ,'reset');
    Ø.setAttribute('value' ,value);
    Ø.setAttribute('id'    ,id);
    
    Ø.onclick = onclick;
    
    return Ø;
}

DOMHelper.prototype.textfield =
function
DOMHelper_textfield ( name ,onchange ,id )
{
    id = id || this.generateId();

    var Ø = document.createElement('INPUT');
    Ø.setAttribute('type' ,'text');
    Ø.setAttribute('name' ,name);
    Ø.setAttribute('id'   ,id);
    
    Ø.onchange = onchange;
    
    return Ø;
}

DOMHelper.prototype.fileload =
function
DOMHelper_fileload ( name ,onchange ,id )
{
    id = id || this.generateId();

    var Ø = document.createElement('INPUT');
    Ø.setAttribute('type' ,'file');
    Ø.setAttribute('name' ,name);
    Ø.setAttribute('id'   ,id);
    
    Ø.onchange = onchange;
    
    return Ø;
}

DOMHelper.prototype.number =
function
DOMHelper_number ( id ,min ,max ,value ,onchange )
{
    id = id || this.generateId();

    value = value || min;

    var Ø = document.createElement('INPUT');
    Ø.setAttribute('type'  ,'number');
    Ø.setAttribute('id'    ,id);
    Ø.setAttribute('min'   ,min);
    Ø.setAttribute('max'   ,max);
    Ø.setAttribute('value' ,value);

    Ø.onchange = onchange;

    return Ø;
}

DOMHelper.prototype.range =
function
DOMHelper_range ( id ,min ,max ,value ,onchange )
{
    id = id || this.generateId();

    value = value || min;

    var Ø = document.createElement('INPUT');
    Ø.setAttribute('type'  ,'range');
    Ø.setAttribute('id'    ,id);
    Ø.setAttribute('min'   ,min);
    Ø.setAttribute('max'   ,max);
    Ø.setAttribute('value' ,value);

    //x.onchange = onchange;
    Ø.onmousemove = onchange;

    return Ø;
}

DOMHelper.prototype.select =
function
DOMHelper_select ( name ,onchange ,id ,size ,multiple )
{
    id = id || this.generateId();
    size = size || 0;
    multiple = multiple || false;

    var Ø = document.createElement('SELECT');
    Ø.setAttribute('name' ,name);
    Ø.setAttribute('id'   ,id);
    Ø.setAttribute('size' ,size);

    Ø.multiple = multiple;
    
    Ø.onchange = onchange;
    
    return Ø;
}

DOMHelper.prototype.option =
function
DOMHelper_option ( value ,label ,selected )
{
    selected = selected || false;
    label = label || value;

    var Ø = document.createElement('OPTION');
    Ø.setAttribute('value' ,value);
    Ø.appendChild( isHTMLElement(text) ? text : document.createTextNode(text) );
    
    Ø.selected = selected;
    
    return Ø;
}

DOMHelper.prototype.optiongroup =
function
DOMHelper_optiongroup ( label ,disabled )
{
    disabled = disabled || false;

    var Ø = document.createElement('OPTGROUP');
    Ø.setAttribute('label' ,label);
    Ø.disabled = disabled;
    return Ø;
}

DOMHelper.prototype.hidden =
function
DOMHelper_hidden ( id ,value )
{
    id = id || this.generateId();

    var Ø = document.createElement('INPUT');
    Ø.setAttribute('type'  ,'hidden');
    Ø.setAttribute('name'  ,id);
    Ø.setAttribute('id'    ,id);
    Ø.setAttribute('value' ,value);
    
    return Ø;
}

DOMHelper.prototype.div =
function
DOMHelper_div ( id )
{
    id = id || this.generateId();

    var Ø = document.createElement('DIV');
    Ø.setAttribute('id' ,id);
    return Ø;
}

DOMHelper.prototype.span =
function
DOMHelper_span ( id )
{
    id = id || this.generateId();

    var Ø = document.createElement('SPAN');
    Ø.setAttribute('id' ,id);
    return Ø;
}

DOMHelper.prototype.paragraph =
function
DOMHelper_paragraph ( text )
{
    var Ø = document.createElement('P');
    Ø.appendChild( isHTMLElement(text) ? text : document.createTextNode(text) );
    return Ø;
}

DOMHelper.prototype.bold =
function
DOMHelper_underscore ( text )
{
    var Ø = document.createElement('B');
    Ø.appendChild( isHTMLElement(text) ? text : document.createTextNode(text) );
    return Ø;
}

DOMHelper.prototype.underscore =
function
DOMHelper_underscore ( text )
{
    var Ø = document.createElement('U');
    Ø.appendChild( isHTMLElement(text) ? text : document.createTextNode(text) );
    return Ø;
}

DOMHelper.prototype.italic =
function
DOMHelper_italic ( text )
{
    var Ø = document.createElement('I');
    Ø.appendChild( isHTMLElement(text) ? text : document.createTextNode(text) );
    return Ø;
}

DOMHelper.prototype.text =
function
DOMHelper_text ( text )
{
    return document.createTextNode(text);
}

DOMHelper.prototype.strike =
function
DOMHelper_strike ( text )
{
    var Ø = document.createElement('S');
    Ø.appendChild( isHTMLElement(text) ? text : document.createTextNode(text) );
    return Ø;
}

DOMHelper.prototype.anchor =
function
DOMHelper_anchor ( text ,href )
{
    var Ø = document.createElement('A');
    Ø.appendChild( isHTMLElement(text) ? text : document.createTextNode(text) );
    Ø.setAttribute('href' ,href);
    return Ø;
}

DOMHelper.prototype.pre =
function
DOMHelper_pre ( text )
{
    var Ø = document.createElement('PRE');
    var t = document.createTextNode(text);
    Ø.appendChild(t);
    return Ø;
}

DOMHelper.prototype.orderedLine =
function
DOMHelper_orderedLine ()
{
    return document.createElement('OL');
}

DOMHelper.prototype.unorderedLine =
function
DOMHelper_unorderedLine ()
{
    return document.createElement('UL');
}

DOMHelper.prototype.line =
function
DOMHelper_line ( text )
{
    var Ø = document.createElement('LI');
    Ø.appendChild( isHTMLElement(text) ? text : document.createTextNode(text) );
    return Ø;
}

DOMHelper.prototype.table =
function
DOMHelper_table ()
{
    return document.createElement('TABLE');
}

DOMHelper.prototype.tableLine =
function
DOMHelper_tableLine ()
{
    return document.createElement('TR');
}

DOMHelper.prototype.tableCeil =
function
DOMHelper_tableCeil ( RowCol )
{
    var Ø = document.createElement('TD');
    if ( RowCol )
    {
        if ( RowCol['row'] ) x.setAttribute('rowspan' ,RowCol['row']);
        if ( RowCol['col'] ) x.setAttribute('colspan' ,RowCol['col']);
    }
    return Ø;
}

DOMHelper.prototype.tableHead =
function
DOMHelper_tableHead ( RowCol )
{
    var Ø = document.createElement('TH');
    if ( RowCol )
    {
        if ( RowCol['row'] ) x.setAttribute('rowspan' ,RowCol['row']);
        if ( RowCol['col'] ) x.setAttribute('colspan' ,RowCol['col']);
    }
    return Ø;
}

DOMHelper.prototype.canvas =
function
DOMHelper_canvas ( id ,width ,height )
{
    id = id || this.generateId();

    var Ø = document.createElement('CANVAS');
    Ø.setAttribute('id'     ,id);
    Ø.setAttribute('width'  ,width);
    Ø.setAttribute('height' ,height);    
    return Ø;
}

var DOMHelper = new DOMHelper();
window.DOMHelper = DOMHelper;