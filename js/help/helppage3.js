/**
 * 3-я страница помощи.
 */

class HelpPage3 extends ImageItem {

    constructor( parent, options ) {
        super( parent, options );

        let text1 = 'RULES';
        new TextItem( this, text1, {
            x: 0, y: 23,
            color: options.title.color,
            align: 'centerX',
            fontFamily: options.title.fontName,
            fontSize: options.title.fontSize,
            fontWeight: 'bold',
        });

        let text2 = [
            'All prizes are for combinations of a kind. All prizes are for',
            'combinations left to right, except scatters. All prizes are on selected',
            'lines, except scatters. Scatter symbols pay at any position on screen.',
            'Highest win only paid on each selected line and per scatter',
            'combination. Scatter wins and line wins are added. The paytable',
            'always shows the prizes for the currently selected bet and number of',
            'lines. Free Games can be won again during the Free Games.',
            'Free Games are played at trigger bet and lines.'
        ];

        new TextItem( this, text2, {
            x: 0, y: 100,
            color: options.text.color,
            align: 'centerX',
            fontFamily: options.title.fontName,
            fontSize: options.text.fontSize,
            fontWeight: 'bold',
            lineHeight: 42
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
