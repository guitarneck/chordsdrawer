function
edition_ui_buttons_insert ( value ,beg, end, str )
{
    return value.substr(0, beg) + str + value.substr(end, value.length);
};

function
edition_ui_buttons_specialChar ( char )
{
    var inputText = $DB.byId(UIIDS.title);
    if ( inputText.value.length === inputText.maxLength ) return;
    
    var selPos = selEnd = inputText.value.length,
        selLen = 0;
    
    if (typeof inputText.selectionStart !== 'undefined')
    {
        // FF - Ok
        selPos = inputText.selectionStart;
        selEnd = inputText.selectionEnd;
        if ( selPos > selEnd ) {var Ø=selpos;selPos=selEnd;selEnd=Ø}
        selLen = selPos - selEnd;
    }
    
    inputText.value = edition_ui_buttons_insert( inputText.value ,selPos ,selEnd ,char );
    inputText.onchange();
    inputText.focus();
}

var edition_ui_buttons_HChordsMap = {
//'grande (':0xF028,
//'grande )':0xF029,

    0 : {
        'A':0xF041, 'Bb':0xF049, 'B':0xF042, 'C':0xF043, 'D':0xF044, 'E':0xF045, 'F':0xF046, 'G':0xF047, 'H':0xF048,
        
        'separator':null,

        'bemol':0xF062, 'becarre':0xF021, 'diese':0xF023
    },

    2 : {
        'm':0xF06D, 'm7/b5':0xF03A, 'min':0xF06E,
 
        '-':0xF02D, '-7/b5':0xF02E, '+':0xF02B,

        'semi dim':0xF025, 'o':0xF030,

        'dim.':0xF038, 'add':0xF061, 'aug':0xF05F
    },
    
    3 : {
        'sus 2':0xF022, 'sus 4':0xF024, 'sus 2 4':0xF075
    },
    
    4 : {
        'up 2':0xF032,
        'up 4':0xF034,
        'up b5':0xF050, 'up 5':0xF035, 'up #5':0xF04F, 'up +5':0xF074,
        'up 6':0xF036,
        'up 7':0xF037,
        'up b9':0xF068, 'up 9':0xF039, 'up #9':0xF04B,
        'up 11':0xF031, 'up #11':0xF04C,
        'up b13':0xF04E, 'up 13':0xF033,

        'separator':null,

        'up maj':0xF072,

        'separator-':null,

        'up maj7':0xF04D, 'up triangle':0xF05E,

        'separator--':null,

        '/':0xF02F,

        'separator---':null,

        'bemol up':0xF03C, 'becarre up':0xF03D, 'diese up':0xF03E, 

        'separator----':null,

        'up (':0xF05B, 'up )':0xF05D,
    },
    
    5 : {
        'up b5 b9':0xF067,
        'up b5 9':0xF063,
        'up b5 #9':0xF051,

        'separator':null,

        'up b5 b13':0xF027,
        'up b5 13':0xF026,

        'separator-':null,

        'up #5 b9':0xF02C,
        'up #5 #13':0xF02A,

        'separator--':null,

        'up 6 9':0xF066,

        'separator---':null,

        'up 9 13':0xF064
    },

    8 : {
        'up 5 (no 3)':0xF06F,
        'up b5 (no 3)':0xF070,
        'up #5 (no 3)':0xF071
    },
    
    9 : {
        'on A':0xF052,
        'on B':0xF053,
        'on Bb':0xF054,
        'on C':0xF055,
        'on D':0xF056,
        'on E':0xF057,
        'on F':0xF058,
        'on G':0xF059,
        'on H':0xF05A,

        'separator-':null,

        'bemol bas':0xF06A,
        'becarre bas':0xF06B,
        'diese bas':0xF06C
    }
};

function
edition_ui_buttons_append ( parent )
{
    var i = 1,span;
    
    for ( var category in edition_ui_buttons_HChordsMap )
    {
        span = $DB.class($DB.span(),'btgroup');
        $DB.append(parent,span);
        for ( var glyph in edition_ui_buttons_HChordsMap[category] )
        {
            if ( edition_ui_buttons_HChordsMap[category][glyph] === null )
            {
                //$DB.append(parent,$DB.nbsp());        
                span = $DB.class($DB.span(),'btgroup');
                $DB.append(parent,span);
            }
            else
                $DB.append(span,
                    $DB.class(
                        $DB.button(String.fromCharCode(edition_ui_buttons_HChordsMap[category][glyph]) ,function(){
                            edition_ui_buttons_specialChar( this.value );
                        }),
                        "chords-font"
                    )
                );
        }
        parent.appendChild($DB.attachAttributesList($DB.hr(),{'style':'border:0;border-top:1px solid grey'}));
    }
    
    parent.removeChild(parent.lastChild);
}