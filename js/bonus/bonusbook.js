/**
 * Книга на баннере начала бонус-игры.
 */

class BonusBook extends ImageItem {

    /** Нарезка страниц книги для текстур переворачиваемых страниц */
    static pagesDef = [
        { x: 0,   y: 0, w: 153, h: 288 },
        { x: 153, y: 0, w: 108, h: 288 },
        { x: 261, y: 0, w:  73, h: 288 },
        { x: 334, y: 0, w:  41, h: 288 },
        { x: 375, y: 0, w:  69, h: 288 },
        { x: 444, y: 0, w: 131, h: 288 },
        { x: 575, y: 0, w: 163, h: 288 },
    ];

    /** Положение переворачиваемых страниц книги */
    static pagesPos = [
        { x: 230, y: 0 },
        { x: 230, y: -2 },
        { x: 225, y: -4 },
        { x: 222, y: -7 },
        { x: 159, y: 0 },
        { x:  99, y: 0 },
        { x:  67, y: 0 },
    ];

    /** Текстуры переворачиваемых страниц книги */
    pageTextures;

    /** Нарезка и расположение символов для переворачиваемых страниц */
    static symbolDef = {
        pages: [
            { x: 170, y: 67, w:  52, h: 166 },  // для 5-го фрейма страницы
            { x: 123, y: 58, w: 101, h: 169 },  // для 6-го фрейма страницы
            { x:  90, y: 67, w: 132, h: 150 },  // для 7-го фрейма страницы
            { x:  93, y: 72, w: 126, h: 135 },  // после переворота страницы
        ],
        symbols: [                              // номера символов в спрайтах
            1, 2, 3, 4, 6, 7, 8, 9, 10
        ]
    };

    /** Текстуры символов для переворачиваемых страниц */
    symbolTextures;

    /** Объект анимации переворота страниц книги */
    pageAnime;

    /** Номер символа, отображаемого на переворачиваемой странице */
    symbol;

    /** Объект отображения символа на переворачиваемой странице */
    flippedSymbolSprite;

    /** Объект отображения символа после переворота страницы */
    symbolSprite;

    soundIndex;

    constructor( parent, options ) {

        super( parent, options.book );

        this.soundIndex = 0;

        // Спрайт для отображения символа после переворачивания страниц
        this.symbolSprite = new PIXI.Sprite();
        this.symbolSprite.visible = false;
        this.pixiObj.addChild( this.symbolSprite );

        // Текстуры для анимации переворачивания страниц
        let sprite = PIXI.Texture.from( options.book.flipPages.urls[0] );
        let pageTextures = [];
        for ( let i = 0; i < 7; ++i ) {
            let p = BonusBook.pagesDef[i];
            let rect = new PIXI.Rectangle( p.x, p.y, p.w, p.h );
            let texture = new PIXI.Texture( sprite.baseTexture, rect );
            pageTextures.push( texture );
        }
        this.pageTextures = pageTextures;

        // Анимация переворачивания страниц
        this.pageAnime = new PIXI.AnimatedSprite( pageTextures );
        this.pageAnime.visible = false;
        this.pageAnime.animationSpeed = 0.3;
        this.pageAnime.loop = false;
        this.pageAnime.onComplete = ()=>{
            this.onPageFlipFinished();
        };
        this.pageAnime.onFrameChange = ( idx )=>{
            this.onPageFrameChanged( idx );
        };
        this.pixiObj.addChild( this.pageAnime );

        // Текстуры символов
        this.symbolTextures = [];
        for ( let i = 0; i < 4; ++i ) {
            let sprite = PIXI.Texture.from( options.book.flipSymbols.urls[ i ] );
            let p = BonusBook.symbolDef.pages[i];
            let textures = [];
            for ( let j = 0; j < 9; ++j ) {
                let rect = new PIXI.Rectangle( j * p.w, 0, p.w, p.h );
                let texture = new PIXI.Texture( sprite.baseTexture, rect );
                textures.push( texture );
            }
            this.symbolTextures.push( textures );
        }
        this.flippedSymbolSprite = new PIXI.Sprite( this.symbolTextures[0][0] );
        this.flippedSymbolSprite.visible = false;
        this.pixiObj.addChild( this.flippedSymbolSprite );
    }

    reset() {
        this.symbolSprite.visible = false;
        this.symbolSprite.texture = null;
    }

    soundPlay() {
        if ( ++this.soundIndex > 3 ) this.soundIndex = 1;
        Game.instance().startPlay( 'origin/bonus_page' + this.soundIndex );
    }

    /**
     * Запустить переворачивание страниц книги.
     */
    startPageFlip( symbol ) {
        this.symbol = symbol;
        this.symbolSprite.visible = true;
        this.flippedSymbolSprite.visible = false;
        this.pageAnime.visible = true;
        this.setPageFrame( 0 );
        this.pageAnime.gotoAndPlay( 0 );
        this.soundPlay();
    }

    /**
     * Обработка завершения одного кадра переворота страницы.
     */
    onPageFrameChanged( idx ) {
        this.setPageFrame( idx );
    }

    /**
     * По окончании переворачивания страниц показать последний кадр.
     */
    onPageFlipFinished() {

        Log.out( 'Page flip finished' );

        // Скрыть переворачиваему страницу книги
        this.pageAnime.visible = false;
        this.flippedSymbolSprite.visible = false;

        // Показать последнюю картинку символа
        this.setLastSymbol();

        // Отправить событие о завершении показа символа
        this.emit( 'pageFlipped', { symbol: this.symbol } );
    }

    setPageFrame( idx ) {
        let scale = this.parent.scale();
        let parentPos = this.pos();
        this.pageAnime.x = parentPos.x + BonusBook.pagesPos[ idx ].x * scale.x;
        this.pageAnime.y = parentPos.y + BonusBook.pagesPos[ idx ].y * scale.y;
        this.pageAnime.width = BonusBook.pagesDef[ idx ].w * scale.x;
        this.pageAnime.height = BonusBook.pagesDef[ idx ].h * scale.y;
        if ( idx >= 4 ) {   // показать символ на странице
            idx -= 4;
            if ( idx == 0 ) this.flippedSymbolSprite.visible = true;
            let pos = BonusBook.symbolDef.symbols.indexOf( this.symbol );
            this.flippedSymbolSprite.texture = this.symbolTextures[ idx ][ pos ];
            this.flippedSymbolSprite.x = parentPos.x + BonusBook.symbolDef.pages[ idx ].x * scale.x;
            this.flippedSymbolSprite.y = parentPos.y + BonusBook.symbolDef.pages[ idx ].y * scale.y;
            this.flippedSymbolSprite.width = BonusBook.symbolDef.pages[ idx ].w * scale.x;
            this.flippedSymbolSprite.height = BonusBook.symbolDef.pages[ idx ].h * scale.y;
        }
    }

    /**
     * Разместить последний символ.
     */
    setLastSymbol() {
        let scale = this.parent.scale();
        let parentPos = this.pos();
        let pos = BonusBook.symbolDef.symbols.indexOf( this.symbol );

        this.symbolSprite.texture = this.symbolTextures[ 3 ][ pos ];
        this.symbolSprite.x = parentPos.x + BonusBook.symbolDef.pages[ 3 ].x * scale.x;
        this.symbolSprite.y = parentPos.y + BonusBook.symbolDef.pages[ 3 ].y * scale.y;
        this.symbolSprite.width = BonusBook.symbolDef.pages[ 3 ].w * scale.x;
        this.symbolSprite.height = BonusBook.symbolDef.pages[ 3 ].h * scale.y;
    }

    draw() {
        super.draw();
        this.setLastSymbol();
    }
}
