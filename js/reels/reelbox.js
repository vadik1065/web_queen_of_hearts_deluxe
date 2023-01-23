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


        // Текстуры для анимации ангела с сердцем
        let awhOptions = [24,4,125,109] // @params колличество, столбцы, ширина, высота 
        this.angelWitchHeart = this.getAngelTexture( "./images/game/bonus/cupid_start.png", this.angelWitchHeart,awhOptions );
        this.pixiObj.addChild(this.angelWitchHeart);
        
        let anhOptions = [24,4,84,74] // @params колличество, столбцы, ширина, высота 
        // Текстуры для анимации ангела без сердца
        this.angelNopeHeart = this.getAngelTexture( "./images/game/bonus/cupid_finish.png", this.angelNopeHeart,anhOptions );
        this.pixiObj.addChild(this.angelNopeHeart);


        // setTimeout(()=>{
        //     let symPos = this.children[1].symbolPos(1);
        //     let symSize = this.children[1].symbolSize(1);
        //     let scale =  Game.instance().scale();
        //     let bkgPos = Game.instance().background.pos();

        //     this.angelCoor  = 
        //     [
        //         ((symPos.x - bkgPos.x ) /  scale.x) +  this.angelWitchHeart.width / 4,
        //         ((symPos.y - bkgPos.y ) /  scale.y ) +  this.angelWitchHeart.height / 5
        //     ];
        //     this.angelWitchHeart.visible = true;
        //     this.draw();

        //     // this.angelGiveHeartAnim(2,0,1,0);
        // },1000)
    };

    getAngelTexture(url,angel, options){
        let sprite = PIXI.Texture.from( url);
        let textures = [];
        let count = options[0];
        let column = options[1];
        let width = options[2];
        let height = options[3];
        for ( let i = 0; i < count; ++i ) {
            let x = ( i % column ) * width;
            let y = Math.floor( i / column ) * height;
            let rect = new PIXI.Rectangle( x, y, width, height );
            let texture = new PIXI.Texture( sprite.baseTexture, rect );
            textures.push( texture );
        }

        // Анимация ангела с сердцем
        angel = new PIXI.AnimatedSprite( textures );
        angel.visible = false;
        angel.loop = true;
        angel.animationSpeed = 0.3;
        return angel
    }

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
        this.setAngelAnimPos(...this.angelCoor);
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
            game.startPlay( 'reelstop' );
        }

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
        let heartPoint = game.serverData.bonusGame?.heartPoints?.[num];
        Log.out('heartPoint '+num)
        if(heartPoint){
            let inxRell = heartPoint[0];
            let numRell = heartPoint[1];
            let numHeart = 0;
            reelBox.angelGiveHeartAnim(inxRell,num, numRell,numHeart);
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


    
    /**
     * 
     * описание ангела
     * 
     */

    // скорость ангела
    angelSpeed = 0.08;

    // координаты начала полёта
    angelbeginCoor = [1700,150];
    
    // координаты конца полёта
    angelEndCoor = [0,140];

    // координаты ангела
    angelCoor = [-50,-50];

    // коэффициент направление по Х
    directX ;

    // коэффициент направление по У
    directY ;

    // позиция куда нужно принести сердце
    heartCoors = [0, 0];

    // параметры для ангела
    angelData;

    // флаг с сердцем ли ангел
    angelIsHeart;

    // маршрут вылета ангела
    routeToHeart(x,y){
        let game = Game.instance();
        let reelBox = game.reelBox;

        if ( x <= reelBox.heartCoors[0] && y >= reelBox.heartCoors[1] ){
            game.removeTiker(reelBox.routeFlight);
            // reelBox.angelWitchHeart.onLoop = () =>{
                let inxRell = reelBox.angelData.inxRell;
                let numRell = reelBox.angelData.numRell;
                let numHeart = reelBox.angelData.numHeart;

                reelBox.angelIsHeart = false;
                reelBox.children[inxRell].setSymbol(numRell,numHeart);
                reelBox.setAngelAnimPos(x,y);
                reelBox.angelNopeHeart.visible = true;
                reelBox.angelNopeHeart.play();
                reelBox.angelWitchHeart.stop();
                reelBox.angelWitchHeart.visible = false;

                reelBox.directX = (reelBox.angelCoor[0] - this.angelEndCoor[0]) * reelBox.angelSpeed * 0.1;
                reelBox.directY = (reelBox.angelCoor[1] - this.angelEndCoor[1]) * reelBox.angelSpeed * 0.1;
                
                game.addTiker(reelBox.routeFlight);
            // }
            return false;
        }
        return true;
    }

    // полёт ангела
    routeFlight(){
        let game = Game.instance();
        let reelBox = game.reelBox;

        let x = reelBox.angelCoor[0] ;
        let y = reelBox.angelCoor[1];

        let isContinueFlight = reelBox.angelIsHeart ? reelBox.routeToHeart(x,y) : reelBox.routeFromHeart(x,y);
           
        if(isContinueFlight){
            reelBox.setAngelAnimPos(x,y);
 
            x-= reelBox.directX ;
            y-= reelBox.directY ;
            reelBox.angelCoor[0] = x;
            reelBox.angelCoor[1] = y;
        }
    }

    // маршрут залёта ангела
    routeFromHeart(x,y){
        let game = Game.instance();
        let reelBox = game.reelBox;

        if ( x <= reelBox.angelEndCoor[0] && y <= reelBox.angelEndCoor[1] ){
            game.removeTiker(reelBox.routeFlight);
            reelBox.angelNopeHeart.stop();
            reelBox.angelNopeHeart.visible = false;

            console.log('reelBox.angelData.num ',reelBox.angelData.num);
            reelBox.emit( 'angelGiveHeart', {num: reelBox.angelData.num + 1} );
            return false;
        }
        return true;
    }


    // устанавливает координаты ангелу
    setAngelAnimPos(x,y){
        let game = Game.instance();
        let scale = game.scale();
        let bkgPos = game.background.pos();


        if( this.angelIsHeart){
            this.angelWitchHeart.x = bkgPos.x + x * scale.x;
            this.angelWitchHeart.y = bkgPos.y + y * scale.y;
            this.angelWitchHeart.width = 125 * 1.5 * scale.x ;
            this.angelWitchHeart.height = 109 * 1.5 * scale.y;
        } else{
            this.angelNopeHeart.x = (bkgPos.x + x * scale.x) +  this.angelWitchHeart.width - this.angelNopeHeart.width ;
            this.angelNopeHeart.y = (bkgPos.y + y * scale.y) ;
            this.angelNopeHeart.width = 84 * 1.5 * scale.x ;
            this.angelNopeHeart.height = 74 * 1.5 * scale.y;
        }
    }

    /**
     *
     * @param {inxRell, num, numRell,numHeart} 
     * inxRell - индекс барабана
     * num - номер массива с позициями сердца
     * numRell номер позиции символа
     * numHeart индекс символа
     */

    // ангел пролитает и оставляет сердце
    async angelGiveHeartAnim(inxRell,num, numRell,numHeart){

        function sleep(tm){
         return new Promise((res) => {
            setTimeout(res,tm)
         })   
        };
        await sleep(50);
        console.log('num', num);
        console.log('inxRell', inxRell);
        console.log('numRell', numRell);

        let game = Game.instance();
        let scale = game.scale();
        let bkgPos = game.background.pos();
        this.angelData = {
            inxRell:inxRell,
            num:num,
            numRell:numRell,
            numHeart:numHeart
        }
        this.angelIsHeart = true;
        this.setAngelAnimPos(...this.angelbeginCoor);
        this.angelCoor =  Tools.clone(this.angelbeginCoor);
        this.angelWitchHeart.visible = true;
        this.angelWitchHeart.play();
        let symPos = this.children[inxRell].symbolPos(numRell);
        this.heartCoors = [
            ((symPos.x - bkgPos.x ) /  scale.x) +  this.angelWitchHeart.width / 4.1 ,
            ((symPos.y - bkgPos.y ) /  scale.y ) +  this.angelWitchHeart.height / 10
         ];

        this.directX = (this.angelbeginCoor[0] - this.heartCoors[0]) * this.angelSpeed * 0.1;
        this.directY = (this.angelbeginCoor[1] - this.heartCoors[1]) * this.angelSpeed * 0.1;

        Game.instance().addTiker(this.routeFlight);

        // setTimeout(()=> this.emit( 'angelGiveHeart', {num: num + 1} ),1000);
        // this.angelWitchHeart.visible = false;
        // this.angelWitchHeart.x = this.angelEndCoor[0];
        // this.angelWitchHeart.y = this.angelEndCoor[1];
    }

}

