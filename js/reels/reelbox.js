/**
 * Группа барабанов.
 *
 * Формирует события:
 *
 * 'rotationStarted' - при начале вращения барабанов
 * 'rotationStopped' - при полной остановке вращения барабанов
 *
 */

class ReelBox extends GameItem {

    symbolCount;        // общее число символов

    symbols;            // массив текстур символов

    reels;              // массив описаний барабанов

    rotateStep;         // шаг сдвига смиволов при вращении

    rotated;            // флаг вращения

    stoppedTime;        // массив времени останова барабанов

    bonusSymbols;       // флаг бонусного набора символов

    angelWitchHeart;     // Анимация ангела с сердцем
    
    angelNopeHeart;     // Анимация ангела без сердца

    /**
     * Инициализация барабанов.
     */
    constructor( parent, rotateStep ) {

        super( parent );

        this.rotateStep = rotateStep;
        this.rotated = false;

        // Создать нормальные текстуры всех символов

        this.setBonusMode( false );

        // Массив объектов барабанов

        for ( let i = 0; i < 5; i++ ) {

            let reel = new Reel( this, i );
            reel.addListener( 'stateChanged', this.onReelStateChanged )
        }

        this.addListener( 'angelGiveHeart', this.angelGiveHeart );

    };

    /**
     * Установить режим бонус-игры.
     *
     * @param {bool} bonus флаг бонус игры
     */
    setBonusMode( bonus ) {
        this.bonusSymbols = bonus;

        // Обновить текстуры символов для заданного режима

        this.symbols = [];
        let game = Game.instance();
        let symbols = game.symbols.info;
        let symbolIds = Object.keys( symbols );
        this.symbolCount = symbolIds.length;
        for ( let i = 0; i < this.symbolCount; ++i ) {
            let id = symbolIds[ i ];
            let url = bonus ? symbols[ id ].bonus.url : symbols[ id ].normal.url;
            this.symbols.push( PIXI.Texture.from( url ) );
        }
    }

    /**
     * Получить объект барабана.
     *
     * @param {int} index индекс барабана (от 0 до 4)
     * @returns {ReelBox.children}
     */
    reel( index ) {
        if ( index < 0 || 5 <= index ) {
            Log.error( '### ReelBox: invalid reel index' );
            return null;
        }
        return this.children[ index ];
    }

    /**
     * Обновить положение и размеры барабанов.
     */
    draw() {
        for ( let i = 0; i < 5; i++ ) {
            this.children[ i ].draw();
        }
    };

    /**
     * Установить заданные символы на барабанах.
     */
    setSymbols( symbols ) {
        for ( let i = 0; i < this.children.length; ++i ) {
            this.children[ i ].setSymbols( symbols[i] );
        }
    }

    // получить символ для замены его на сердце
    getReplacesSymbols(){
        let replacedSym =  Math.floor(Math.random() * this.symbolCount);
        while(replacedSym === 1 || replacedSym === 0 ){
        // while(replacedSym === 1 ){
            replacedSym =  Math.floor(Math.random() * this.symbolCount ) ;
        }
        return replacedSym;
    }

    setStoppedSymbols( symbols ) {
        for ( let i = 0; i < 5; i++ ) {
            if ( this.bonusSymbols ){
                symbols[i] = symbols[i].map(el => el === 1 ? this.getReplacesSymbols() : el)
            }
            this.children[ i ].setStoppedSymbols( symbols[ i ] );
        }
    }

    /**
     * Начать вращение барабанов.
     */
    startRotate() {
        if ( ! this.rotated ) {
            Log.out( 'Start rotate' );
            this.rotated = true;
            for ( let i = 0; i < 5; i++ ) {
                this.children[ i ].startRotate();
            }
            this.emit( 'rotationStarted' );
        }
    }

    /**
     * Остановить вращение барабанов.
     *
     * @param {array} sumbols массив символов, которые должны быть на барабанах
     * после останова
     */
    stopRotate( symbols = null ) {
        if ( this.rotated ) {

            Log.out( 'Stop rotate' );

            // Установить символы останова
            if ( symbols ) {
                this.setStoppedSymbols( symbols );
            }

            this.stoppedTime = [
                Date.now(), 0, 0, 0, 0
            ];

            // Остановить 0-ой барабан

            this.children[ 0 ].stopRotate();
        }
    }

    /**
     * Обработка изменения состояния барабанов.
     *
     * @param {int} index индекс барабана
     * @param {Reel.State} state новое состояние. См. Reel.State.
     */
    onReelStateChanged( params ) {

        let index = params.index;
        let state = params.state;

        Log.out( 'Reel ' + index + ' state changed to ' + state );

        let game = Game.instance();
        let reelBox = game.reelBox;

        if ( state === Reel.State.RETURN ) {    // после бампинга проиграть звук останова
            try{
                let scatterId =  game.symbols.scatter.id;
                let sound = game.serverData.setSymbols?.[index].some(symb => symb === scatterId);
                // game.startPlay(  sound ? 'origin/scatter_1' :'reelstop' );
                if (sound){
                    if(index == 0){
                        game.startPlay(  'origin/teaser_1'  );
                    } else if(index == 1){
                        game.startPlay(  'origin/teaser_2'  );
                    } else if(index == 2){
                        game.startPlay(  'origin/teaser_3'  );
                    } else if(index == 3){
                        game.startPlay(  'origin/teaser_4'  );
                    } else if(index == 4){
                        game.startPlay(  'origin/teaser_5'  );
                    } 
                }else {
                    game.startPlay('reelstop' );
                }
            } catch (e){   
                game.startPlay( 'reelstop' );
            }        }

        if ( index < 4 ) {  // для барабанов с 1-го по 4-ый

            if ( state == Reel.State.SLOWDOWN ) {   // началось замедление барабана
                if ( index == 0 ) {
                    game.addTiker( reelBox.slowdownHandler );
                }
            }
        }
        else {              // для 5-го барабана

            if ( state == Reel.State.STOPPED ) {

                // Полный останов последнего барабана

                Log.out( 'All reels are stopped' );
                game.removeTiker( reelBox.slowdownHandler );
                reelBox.rotated = false;

                if (game.serverData?.bonusGame?.heartPoints?.length){
                    reelBox.emit( 'angelGiveHeart', {num:0} );
                } else{
                    reelBox.emit( 'rotationStopped' );
                }
            }
        }
    }


    /**
     * Ангел выносит сердца.
     * @param {object} angelData описание {num:номер массива с позициями сердца}
     */
    angelGiveHeart(angelData){       
        
        console.log(18,angelData);
        
        let num = angelData.num;
        let game = Game.instance();
        let reelBox = game.reelBox;
        console.log('reelBox',reelBox);
        let angelBox = game.angelBox;
        let heartPoint = game.serverData?.bonusGame?.heartPoints?.[num];
        Log.out('heartPoint '+num);
        if(heartPoint){
            let inxRell = heartPoint[0];
            let numRell = heartPoint[1];
            let numHeart = 0;
            angelBox.angelGiveHeartAnim(inxRell,num, numRell,numHeart);
        }else{
            reelBox.emit( 'rotationStopped' );
        }
    }

    /**
     * Обработчик замедления барабанов.
     */
    slowdownHandler() {
        let game = Game.instance();
        let reelBox = game.reelBox;
        for ( let i = 0; i < 4; ++i ) {

            let stoppedTime = reelBox.stoppedTime[ i ];
            if ( stoppedTime != 0 ) {  // задано время начала замедления
                let now = Date.now();
                if ( now - stoppedTime >= 300 ) {

                    // Остановить следующий барабан

                    reelBox.stoppedTime[ i ] = 0;
                    reelBox.stoppedTime[ i + 1 ] = now;
                    reelBox.children[ i + 1 ].stopRotate();
                }
            }
        }
    }
}

