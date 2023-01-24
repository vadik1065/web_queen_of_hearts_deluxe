class angelBox extends GameItem {

  constructor( parent ) {
    super(parent);

    // Текстуры для анимации ангела с сердцем
    let awhOptions = [24,4,125,109] // @params колличество, столбцы, ширина, высота 
    this.angelWitchHeart = this.getAngelTexture( "./images/game/bonus/cupid_start.png", this.angelWitchHeart,awhOptions );
    this.pixiObj.addChild(this.angelWitchHeart);
    
    let anhOptions = [24,4,84,74] // @params колличество, столбцы, ширина, высота 
    // Текстуры для анимации ангела без сердца
    this.angelNopeHeart = this.getAngelTexture( "./images/game/bonus/cupid_finish.png", this.angelNopeHeart,anhOptions );
    this.pixiObj.addChild(this.angelNopeHeart);

    // setTimeout(()=>{
    //     let symPos = rellBox.children[1].symbolPos(1);
    //     let symSize = rellBox.children[1].symbolSize(1);
    //     let scale =  Game.instance().scale();
    //     let bkgPos = Game.instance().background.pos();

    //     this.angelCoor  = 
    //     [
    //       15,150
    //     ];
    //     this.angelWitchHeart.visible = true;
    //     this.draw();
    //     this.angelWitchHeart.x = 50;
    //     this.angelWitchHeart.y = 150;
    //     this.angelWitchHeart.zIndex = 150;

    //     // this.angelGiveHeartAnim(2,0,1,0);
    // },1000)
  }


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
     * 
     * описание ангела
     * 
     */

    // скорость ангела
    angelSpeed = 0.15;

    // координаты начала полёта
    angelbeginCoor = [1700,100];
    // angelbeginCoor = [1100,100];
    
    // координаты конца полёта
    // angelEndCoor = [0,140];
    angelEndCoor = [-230,100];

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
        let angelBox = game.angelBox;

        if ( x <= angelBox.heartCoors[0] && y >= angelBox.heartCoors[1] ){
            // game.removeTiker(reelBox.routeFlight);
            // reelBox.angelWitchHeart.onLoop = () =>{
            let inxRell = angelBox.angelData.inxRell;
            let numRell = angelBox.angelData.numRell;
            let numHeart = angelBox.angelData.numHeart;

            angelBox.angelIsHeart = false;
            reelBox.children[inxRell].setSymbol(numRell,numHeart);
            angelBox.setAngelAnimPos(x,y);
            angelBox.angelNopeHeart.visible = true;
            angelBox.angelNopeHeart.play();
            angelBox.angelWitchHeart.stop();
            angelBox.angelWitchHeart.visible = false;

            // reelBox.directX = (reelBox.angelCoor[0] - reelBox.angelEndCoor[0]) * reelBox.angelSpeed * 0.1;
            // reelBox.directY = (reelBox.angelCoor[1] - reelBox.angelEndCoor[1]) * reelBox.angelSpeed * 0.1;
            
            // game.addTiker(reelBox.routeFlight);
            // }
            return false;
        }
        return true;
    }

    // полёт ангела
    routeFlight(){
        let game = Game.instance();
        let reelBox = game.reelBox;
        let angelBox = game.angelBox;

        let x = angelBox.angelCoor[0] ;
        let y = angelBox.angelCoor[1];

        let isContinueFlight = angelBox.angelIsHeart ? angelBox.routeToHeart(x,y) : angelBox.routeFromHeart(x,y);
           
        if(isContinueFlight){
          angelBox.setAngelAnimPos(x,y);
 
            if(angelBox.angelIsHeart){
                x-= angelBox.directX ;
                y-= angelBox.directY ;
            } else{
                x-= angelBox.directX ;
                y+= angelBox.directY ;
            }
            angelBox.angelCoor[0] = x;
            angelBox.angelCoor[1] = y;
        }
    }

    // маршрут залёта ангела
    routeFromHeart(x,y){
        let game = Game.instance();
        let reelBox = game.reelBox;
        let angelBox = game.angelBox;

        if ( x <= angelBox.angelEndCoor[0] ){
            game.removeTiker(angelBox.routeFlight);
            angelBox.angelNopeHeart.stop();
            angelBox.angelNopeHeart.visible = false;

            console.log('angelBox.angelData.num ',angelBox.angelData.num);
            reelBox.emit( 'angelGiveHeart', {num: angelBox.angelData.num + 1} );
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

        // function sleep(tm){
        //  return new Promise((res) => {
        //     setTimeout(res,tm)
        //  })   
        // };
        // await sleep(50);
        // console.log('num', num);
        // console.log('inxRell', inxRell);
        // console.log('numRell', numRell);

        let game = Game.instance();
        let rellBox = game.reelBox;
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
        let symPos = rellBox.children[inxRell].symbolPos(numRell);
        this.heartCoors = [
            ((symPos.x - bkgPos.x ) /  scale.x) +  this.angelWitchHeart.width / 4.1 ,
            ((symPos.y - bkgPos.y ) /  scale.y ) +  this.angelWitchHeart.height / 10
         ];

         console.log(18,this.heartCoors);

        this.directX = (this.angelbeginCoor[0] - this.heartCoors[0]) * this.angelSpeed * 0.1;
        this.directY = (this.angelbeginCoor[1] - this.heartCoors[1]) * this.angelSpeed * 0.1;

        Game.instance().addTiker(this.routeFlight);

        // setTimeout(()=> this.emit( 'angelGiveHeart', {num: num + 1} ),1000);
        // this.angelWitchHeart.visible = false;
        // this.angelWitchHeart.x = this.angelEndCoor[0];
        // this.angelWitchHeart.y = this.angelEndCoor[1];
    }

    draw(){
      this.setAngelAnimPos(...this.angelCoor);
      super.draw();
    }

}