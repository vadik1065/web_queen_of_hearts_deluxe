/**
 * Анимированный выигрышный символ.
 */

class WinSymbol extends GameItem {

    /**
     * Параметры отображения символа:
     *
     * symbol - идентификатор символа (может отличаться от символа на барабане)
     * reelIndex - индекс барабана
     * symbolPos - позиция заданного символа на барабане
     */
    options;

    /** Текстуры для анимации */
    textures;

    /** Анимированный спрайт */
    anime;

    constructor( parent, options, layer = null ) {
        super( parent, layer );

        this.options = Tools.clone( options );

        Log.out( 'New WinSymbol: ' + JSON.stringify( options ) );

        let game = Game.instance();
        let reelBox = game.reelBox;
        let symbol = options.symbol;

        let speed = 0;
        let textures = [];
        let info = game.symbols.info[ symbol ];
        let def = reelBox.bonusSymbols ? info.bonus : info.normal;
        let longs = def.longs;

        let curSprite = def.sprite;
        if(game.aLotOfSymbols.includes(symbol) && longs?.length){
            curSprite = longs[0];
        }

       
        if ( curSprite ) {    // задан спрайт
            let cnt =curSprite.count;
            let colCount =curSprite.columns;
            let symbolSize = game.symbols.size.horizontal;
            let sprite = PIXI.Texture.from( curSprite.url );
            for ( let i = 0; i < cnt; ++i ) {
                let x = ( i % colCount ) * symbolSize.width;
                let y = Math.floor( i / colCount ) * symbolSize.height;
                let rect = new PIXI.Rectangle( x, y, symbolSize.width, symbolSize.height );
                let texture = new PIXI.Texture( sprite.baseTexture, rect );
                textures.push( texture );
            }
            speed = cnt * 0.01;
        }
        else if ( def.animate ) {     // анимация одиночного символа
            textures.push( PIXI.Texture.from( def.animate ) );
            textures.push( PIXI.Texture.from( def.url ) );
            speed = 0.05;
        }
        else {
            Log.error( '### Line: not found animation style for symbol ' + symbol );
        }
        this.textures = textures;
        this.anime = new PIXI.AnimatedSprite( textures );
        this.anime.animationSpeed = speed;
        this.anime.loop = true;
        this.anime.play();
        this.pixiObj.addChild( this.anime );

    }

    destroy() {
        this.pixiObj.removeChild( this.anime );
        this.anime.destroy();
        this.anime = null;
    }

    draw() {
        let anime = this.anime;
        if ( anime ) {
            let reelBox = Game.instance().reelBox;
            let reel = reelBox.reel( this.options.reelIndex );

            let pos = this.options.symbolPos;
            let symPos = reel.symbolPos( pos );
            let symSize = reel.symbolSize( pos );

            anime.x = symPos.x;
            anime.y = symPos.y;
            anime.width = symSize.width;
            anime.height = symSize.height;
        }
    }

    scale() {
        return this.parent.scale();
    }
}
