(function StringsSetTests (){

    var stringsSet = null;
    var assert = chai.assert;
    
    var Intercept = {
        _old:{},
        _messages:[],
        messages:function(what){return this._messages},
        on:function(what){this._old[what]=console[what];this._messages=[];console[what]=this.intercept},
        intercept:function(txt){Intercept._messages.push(txt)},
        off:function(what){console[what]=this._old[what];this._old[what]=null;this._messages=[]}
    };

    describe('StringsSet.test.js',function(){
        it('Create an StringsSet' ,function(cb){
            stringsSet = new StringsSet();
            assert.exists( stringsSet ,"StringsSet was created" );
            cb();
        });

        it('The stringsSet is initialised' ,function(cb){
            assert.strictEqual( stringsSet.strings ,'x;x;x;x;x;x;' ,"strings are correct");
            assert.strictEqual( stringsSet.len ,6 ,"len is correct");
            cb();
        });
        
        context('Work with strings',function(){
            it('Should throw an out of range error message',function(cb){
                Intercept.on('error');
                stringsSet.setString(6,stringsSet.opened)
                assert.include( Intercept.messages('error') ,"StringsSet.setString() : Parameter string out of range." ,"StringsSet must throw an error");
                stringsSet.setString(0,stringsSet.opened,6)
                assert.include( Intercept.messages('error') ,"StringsSet.setString() : Parameter toString out of range." ,"StringsSet must throw an error");
                Intercept.off('error');
                cb();
            });

            it('Should have a opened string',function(cb){
                stringsSet.setString(0,stringsSet.opened);
                assert.strictEqual( stringsSet.strings , 'o;x;x;x;x;x;',"strings is opend on position 0");
                cb();
            });

            it('Should have a mutted string',function(cb){
                stringsSet.setString(0,stringsSet.mutted);
                assert.strictEqual( stringsSet.strings , 'x;x;x;x;x;x;',"strings is closed on position 0");
                cb();
            });

            it('Should have a played string',function(cb){
                stringsSet.setString(0,0);
                assert.strictEqual( stringsSet.strings , '0;x;x;x;x;x;',"String 0 must be played on fret 0");
                cb();
            });

            it('Should have a partial filled string',function(cb){
                stringsSet.setString(1,3,3);
                assert.strictEqual( stringsSet.strings , '0;3-(;3;3-);x;x;',"A partial fill from string 1 to 3 on fret 3");
                cb();
            });

            it('Should have a filed string',function(cb){
                stringsSet.setString(0,3,5);
                assert.strictEqual( stringsSet.strings , '3-(;3;3;3;3;3-);',"The strings are totaly filled");
                cb();
            });
        });
        
        context('Work with filled strings',function(){
            it('Should have a filed string with a played one',function(cb){
                stringsSet.setString(1,5);
                assert.strictEqual( stringsSet.strings , '3-(;5;3;3;3;3-);',"The strings are totaly filled with a fret 5 on string 1");
                cb();
            });

            it('Should have a filled upper string',function(cb){
                stringsSet.setString(0,2,5);
                assert.strictEqual( stringsSet.strings , '2-(;5;3;3;3;2-);',"The strings are totaly filled at position 2 with remaining position");
                cb();
            });

            it('Should remove the filled upper string',function(cb){
                stringsSet.setString(0,0);
                assert.strictEqual( stringsSet.strings , '0;5;3;3;3;2;',"The strings are played on 0 with the remaining");
                cb();
            });
        });

        context('Compress strings',function(){
            it('Should compress some strings',function(cb){
                stringsSet.setStrings('x;o;2;2;1;o;');
                var done = stringsSet.compress(1);
                assert.isTrue( done,"The strings can been compressed.");
                assert.strictEqual( stringsSet.strings , 'x;o;1;1;0;o;',"The strings has been compressed from 1 step.");
                cb();
            });

            it('Should not compress some strings',function(cb){
                var done = stringsSet.compress(1);
                assert.isFalse( done,"The strings can't be compressed.");
                assert.strictEqual( stringsSet.strings , 'x;o;1;1;0;o;',"The strings remains the same because compression has aborted.");
                cb();
            });
        });

    });

})();