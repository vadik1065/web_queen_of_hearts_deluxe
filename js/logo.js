/**
 * Логотип игры.
 */

class Logo extends ImageItem {

    constructor( parent, ) {
        super( parent, Game.instance().images.logo ) ;
        this.draw();
    }

    draw() {

        super.draw();

        let game = Game.instance();
        let scale = game.scale();
        let bkgPos = game.background.pos();
        let bkgSize = game.background.size();

        let logo = game.isVertical() ? game.images.logo.vertical : game.images.logo.horizontal;

        this.imageSprite.width = logo.width * scale.x;
        this.imageSprite.height = logo.height * scale.y;

        let newScale = ( logo.maxHeight * scale.y ) / this.imageSprite.height;
        this.imageSprite.width *= newScale;
        this.imageSprite.height *= newScale;

        this.imageSprite.y = 0;
        this.imageSprite.x = bkgPos.x + ( bkgSize.width - this.imageSprite.width ) / 2;
    }
}

