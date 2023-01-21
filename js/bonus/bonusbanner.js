/**
 * Отображение баннера начала бонус-игры.
 */

class BonusBanner extends ImageItem {

    static SYMBOL_BOOK = 5;

    static FONT_SIZE = 44;

    /** Последовательность символов, отображаемая при переворачивании страниц книги */
    pageSymbols;

    /** Индекс символа из отображаемой последовательности */
    symbolIndex;

    /** Последний символ */
    lastSymbol;

    /** Флаг завершения анимации книги */
    animationFinished;

    constructor( parent, options ) {

        super( parent, options.banner );

        // 1-ый блок текста
        new TextItem( this, '', {
           fontFamily: 'Tangodi',
           fontSize: BonusBanner.FONT_SIZE,
           color: 0xFFFF00,
           y: 40,
           align: 'centerX'
        });

        // // Книга в центре
        // let book = new BonusBook( this, options );
        // book.addListener( 'pageFlipped', (params)=>{
        //     this.onPageFlipped( params );
        // });

        // 2-ой блок текста
        // new TextItem( this, '', {
        //    fontFamily: 'Tangodi',
        //    fontSize: BonusBanner.FONT_SIZE,
        //    color: 0xFFFF00,
        //    y: 350,
        //    align: 'centerX',
        //    lineHeight: 40
        // });

        this.setVisible( false );
    }

    /**
     * Показать баннер с книгой и анимацией заданного символа расширения.
     *
     * @param {number} symbol идентификатор символа
     */
    showBook( countFreeSpin ) {
        this.animationFinished = false;

        let text1 = this.children[0];
        text1.options.y = 100;
        text1.options.align = 'centerX';
        text1.updateText( countFreeSpin+' Free Games' );
        text1.setVisible( true );

        this.setVisible( true );
        setTimeout( ()=>{
            this.animationFinished = true;
            this.emit( 'animationFinished' );
        }, 1000 ); 
    }

    /**
     * Показать баннер с текстом.
     *
     * @param {string} text заданный текст
     */
    showText( text ) {

        this.setVisible( true );

        // this.children[1].setVisible( false );

        let textItem = this.children[0];
        textItem.setVisible( true );
        textItem.options.x = 0;
        textItem.options.y = 0;
        textItem.options.align = 'center';
        textItem.updateText( text );
    }

    /**
     * Скрыть баннер.
     */
    hide() {
        this.setVisible( false );
    }

    isAnimationFinished() {
        return this.animationFinished;
    }

    /**
     * Обработка по окончании показа символа на книге.
     *
     * @param {object} params
     */
    onPageFlipped( params ) {
        let symbol = params.symbol;
        if ( symbol == this.lastSymbol ) {  // если показали заданный символ

            // Конец
            Game.instance().startPlay( 'origin/bonus_page4' );
            setTimeout( ()=>{
                this.animationFinished = true;
                this.emit( 'animationFinished' );
            }, 1000 );
        }
     
    }

    /**
     * Текущий масштаб отображения.
     */
    scale() {
        let game = Game.instance();
        let scale = Tools.clone( this.parent.scale() );
        if ( game.isVertical() ) {
            scale.x *= this.options.vertical.width / this.options.horizontal.width,
            scale.y *= this.options.vertical.height / this.options.horizontal.height
        }
        return scale;
    }
}
