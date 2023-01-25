/**
 * 1-я страница помощи.
 */

class HelpPage1 extends ImageItem {

    static data = {
        vertical: {
            scatter: {
                options: {
                    x: 670, y: 325, width: 100, height: 107,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: true, values: [ 400, 20, 5, 2 ]
            },
            rose: {
                options: {
                    x: 95, y:40, width: 148, height: 119,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 3000, 300, 50, 5 ]
            },
            heart: {
                options: {
                    x: 600, y: 30, width: 140, height: 113,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 10000, 2000, 200, 10, 2 ]
            },
            town: {
                options: {
                    x: 950, y: 40, width: 160, height: 124,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 500, 100, 25, 2 ]
            },
            crown: {
                options: {
                    x: 185, y: 350, width: 150, height: 120,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 34
                },
                totalBet: false, values: [ 500, 75, 20]
            },
            ring: {
                options: {
                    x: 960, y: 350, width: 160, height: 105,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 500, 75, 20 ]
            },
            k: {
                options: {
                    x: 85, y: 550, width: 160, height: 105,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 250, 50, 10 ]
            },
            q: {
                options: {
                    x: 390, y: 562, width: 160, height: 105,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 200, 50, 10 ]
            },
            j: {
                options: {
                    x: 710, y: 562, width: 160, height: 105,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 200, 25, 5 ]
            },
            109: {
                options: {
                    x: 1000, y: 550, width: 160, height: 105,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 34
                },
                totalBet: false, values: [ 100, 25, 5 ]
            },
        },
        horizontal: {
            scatter: {
                options: {
                    x: 670, y: 325, width: 100, height: 107,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: true, values: [ 400, 20, 5, 2 ]
            },
            rose: {
                options: {
                    x: 95, y:40, width: 148, height: 119,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 3000, 300, 50, 5 ]
            },
            heart: {
                options: {
                    x: 600, y: 30, width: 140, height: 113,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 10000, 2000, 200, 10, 2 ]
            },
            town: {
                options: {
                    x: 950, y: 40, width: 160, height: 124,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 500, 100, 25, 2 ]
            },
            crown: {
                options: {
                    x: 185, y: 350, width: 150, height: 120,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 34
                },
                totalBet: false, values: [ 500, 75, 20]
            },
            ring: {
                options: {
                    x: 960, y: 350, width: 160, height: 105,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 500, 75, 20 ]
            },
            k: {
                options: {
                    x: 85, y: 550, width: 160, height: 105,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 250, 50, 10 ]
            },
            q: {
                options: {
                    x: 390, y: 562, width: 160, height: 105,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 200, 50, 10 ]
            },
            j: {
                options: {
                    x: 710, y: 562, width: 160, height: 105,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 36
                },
                totalBet: false, values: [ 200, 25, 5 ]
            },
            109: {
                options: {
                    x: 1000, y: 550, width: 160, height: 105,
                    color: 0xF0F622, align: 'centerX', fontSize: 30, fontWeight: 'bold', lineHeight: 34
                },
                totalBet: false, values: [ 100, 25, 5 ]
            },
        }
    };

    textItems;

    optionsShadow  = {
        shadow: {
            color: 10,
            angle: 0,
            blur: 15,
            distance: 0
        }
    };

    constructor( parent, options ) {

        let o = Tools.clone( options );
        o.urls = options.payTable.urls;
        super( parent, o );

        this.textItems = [];

        let game = Game.instance();
        let data = game.isVertical() ? HelpPage1.data.vertical : HelpPage1.data.horizontal;
        let names = Object.keys( data );
        for ( let i = 0; i < names.length; ++i ) {
            let name = names[ i ];
            let lineCount = data[ name ].values.length;
            let str = '\n'.repeat( lineCount - 1 );

            let newOptions = {
                ... data[ name ].options,
                // ...this.optionsShadow,
                color:"#000000"
            };
            let item = new TextItem( this, str, newOptions );
            this.textItems.push( item );
        }

        new TextItem( this, 'SUBSTITUTES for ALL symbols \n except scatters', {
            x: 480, y: 220, width: 270, height: 30,
            align: 'centerX',
            color: options.text.color,
            fontFamily: options.text.fontName,
            fontSize: 32,
            fontWeight: 'bold',
            ...this.optionsShadow
        });

        new TextItem( this, 'FREE GAMES', {
            x: 475, y: 485, width: 310, height: 240,
            align: 'centerX',
            color: options.text.color,
            fontFamily: options.text.fontName,
            fontSize: 32,
            fontWeight: 'bold',
            lineHeight: 35,
            ...this.optionsShadow
        });
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

    draw() {
        let game = Game.instance();
        let lineBet = game.selectedBet; // ставка на линию
        let totalBet = game.totalBet;   // полная ставка

        let data = game.isVertical() ? HelpPage1.data.vertical : HelpPage1.data.horizontal;
        let names = Object.keys( data );
        for ( let i = 0; i < names.length; ++i ) {
            let name = names[ i ];
            let lineCount = data[ name ].values.length;
            let bet = data[ name ].totalBet ? totalBet : lineBet;
            let item = this.textItems[i];
            for ( let j = 0; j < lineCount; ++j ) {
                item.textLine( j ).text = Tools.formatAmount( bet * data[ name ].values[ j ] );
            }
        }

        super.draw();
    }
}
