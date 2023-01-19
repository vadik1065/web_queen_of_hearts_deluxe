/**
 * 2-я страница помощи.
 */

class HelpPage2 extends ImageItem {

    constructor( parent, options ) {
        super( parent, options );

        let text1 = 'SUBSTITUTES for ALL symbols EXCEPT';
        new TextItem( this, text1, {
            x: 0, y: 50,
            color: options.title.color,
            align: 'centerX',
            fontFamily: options.title.fontName,
            fontSize: options.title.fontSize,
            fontWeight: 'bold',
        });

        let text2 = 'FEATURE';
        new TextItem( this, text2, {
            x: 0, y: 140,
            color: options.text.color,
            align: 'centerX',
            fontFamily: options.text.fontName,
            fontSize: options.text.fontSize,
            fontWeight: 'bold',
            lineHeight: 40
        });

        new ImageItem( this, options.book );

        new ImageItem( this, { "x": 90, "y": 20, "width": 120, "height": 120,  ...options.symbols.heart } );
        new ImageItem( this,  { "x": 1040, "y": 20, "width": 120, "height": 120,  ...options.symbols.girl } );
       
        new ImageItem( this, { "x": 505, "y": 240, "width": 100, "height": 100,  ...options.symbols.girl }  );
        new ImageItem( this,{ "x": 660, "y": 325, "width": 100, "height": 100,  ...options.symbols.cupid }  );
        let heatrX = window.devicePixelRatio > 1 ? 290 : 330;
        new ImageItem( this,{ "x": heatrX, "y": 400, "width": 100, "height": 100,  ...options.symbols.heart } );

        let text3 = [
            'Any 3, 4 or 5 scattered               trigger, 8, 15 or 20 Free Games ',
            'respectively. After each Free Game               may appear and begin',
            'placing BONUS               randomly on the screen. Free Games can be won ',
            'played (expanding is only triggered if enough symbols for a win again',
            'during The Free Games. Free Games are played at trigger bet and lines. '
        ];
        new TextItem( this, text3, {
            x: 0, y: 270,
            color: options.text.color,
            align: 'centerX',
            fontFamily: options.text.fontName,
            fontSize: options.text.fontSize,
            fontWeight: 'bold',
            lineHeight: 80
        });
    }

    /**
     * Дополнительное масштабирование для вертикального режима.
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
