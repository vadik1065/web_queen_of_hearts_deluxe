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

        // Книга в центре
        let book = new BonusBook( this, options );
        book.addListener( 'pageFlipped', (params)=>{
            this.onPageFlipped( params );
        });

        // 2-ой блок текста
        new TextItem( this, '', {
           fontFamily: 'Tangodi',
           fontSize: BonusBanner.FONT_SIZE,
           color: 0xFFFF00,
           y: 350,
           align: 'centerX',
           lineHeight: 40
        });

        this.setVisible( false );
    }

    /**
     * Показать баннер с книгой и анимацией заданного символа расширения.
     *
     * @param {number} symbol идентификатор символа
     */
    showBook( symbol ) {
        this.lastSymbol = symbol;
        this.animationFinished = false;

        let text1 = this.children[0];
        text1.options.y = 40;
        text1.options.align = 'centerX';
        text1.updateText( '10 Free Games' );
        text1.setVisible( true );

        let text2 = this.children[2];
        text2.options.y = 350;
        text2.options.align = 'centerX';
        text2.updateText( 'with special expanding\nsymbol' );
        text2.setVisible( true );

        // Заполнить массив символами за исключением заданного и символа "книга"
        this.pageSymbols = [];
        for ( let s = 1; s <= 10; ++s ) {
            if ( s !== symbol && s !== BonusBanner.SYMBOL_BOOK ) this.pageSymbols.push( s );
        }

        // Перемешать массив символов
        for ( let i = 0; i < 7; ++i ) {
            var k = Tools.randomInt( i + 1, 7 );
            var x = this.pageSymbols[i];
            this.pageSymbols[i] = this.pageSymbols[k];
            this.pageSymbols[k] = x;
        }

        // Добавить заданный символ
        this.pageSymbols.push( symbol );

        // Подготовить показ символов и открыть баннер
        this.symbolIndex = 0;
        let nextSymbol = this.pageSymbols[ this.symbolIndex ];
        this.setVisible( true );
        let book = this.children[1];
        book.setVisible( true );
        setTimeout( ()=>{ book.startPageFlip( nextSymbol ) }, 500 );
    }

    /**
     * Показать баннер с текстом.
     *
     * @param {string} text заданный текст
     */
    showText( text ) {

        this.setVisible( true );

        this.children[1].setVisible( false );
        this.children[2].setVisible( false );

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
        this.children[1].reset();
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
        else {

            // Показать следующий символ
            let nextSymbol = this.pageSymbols[ ++this.symbolIndex ];
            this.children[1].startPageFlip( nextSymbol );
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
