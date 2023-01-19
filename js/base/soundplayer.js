/**
 * Проигрывание звуковых файлов.
 */

class SoundPlayer extends GameItem {

    static sounds = {
        "22_btd_card_open_same.mp3": { time: 454 },
        "23_btd_card_open.mp3":      { time: 123 },
        "autoplaystart.mp3":         { time: 1561 },
        "autoplaystop.mp3":          { time: 1613 },
        "button.mp3":                { time: 208 },
        "changebet.mp3":             { time: 568 },
        "changemaxbet.mp3":          { time: 463 },
        "creditincrease.mp3":        { time: 9894 },
        "decidegamble.mp3":          { time: 4414 },
        "gamblewin.mp3":             { time: 1691 },
        "origin/bonus_end.mp3":      { time: 7235 },
        "origin/bonus_loop.mp3":     { time: 60577 },
        "origin/bonus_page1.mp3":    { time: 522 },
        "origin/bonus_page2.mp3":    { time: 496 },
        "origin/bonus_page3.mp3":    { time: 496 },
        "origin/bonus_page4.mp3":    { time: 888 },
        "origin/bonus_start.mp3":    { time: 6060 },
        "origin/change_symbols.mp3": { time: 287 },
        "origin/countup.mp3":        { time: 261 },
        "origin/scatter_1.mp3":      { time: 574 },
        "origin/scatter_2.mp3":      { time: 574 },
        "origin/scatter_3.mp3":      { time: 679 },
        "origin/scatter_4.mp3":      { time: 679 },
        "origin/scatter_5.mp3":      { time: 1332 },
        "origin/win_1_long.mp3":     { time: 10396 },
        "origin/win_1_short.mp3":    { time: 3944 },
        "origin/win_2_long.mp3":     { time: 8385 },
        "origin/win_2_short.mp3":    { time: 3030 },
        "origin/win_3_long.mp3":     { time: 6321 },
        "origin/win_3_short.mp3":    { time: 3578 },
        "origin/win_4_long.mp3":     { time: 6504 },
        "origin/win_4_short.mp3":    { time: 3840 },
        "overlayclose.mp3":          { time: 568 },
        "overlayopen.mp3":           { time: 646 },
        "reelrun.mp3":               { time: 4904 },
        "reelsilent.mp3":            { time: 3964 },
        "reelstop.mp3":              { time: 568 },
        "win10.mp3":                 { time: 1195 },
        "win2.mp3":                  { time: 960 },
        "win20.mp3":                 { time: 1247 },
        "win25.mp3":                 { time: 2527 },
        "win5.mp3":                  { time: 1012 },
        "wincountstop.mp3":          { time: 620 },
        "winring_10steps.mp3":       { time: 1789 },
    };

    static suffix = '.mp3';
    static folder = './sounds/';

    static #_inst;

    static instance() {
        return SoundPlayer.#_inst;
    }

    downloadCount;

    muteState;

    constructor( parent ) {
        super( parent );
        SoundPlayer.#_inst = this;
        this.downloadCount = 0;
        this.muteState = false;
        Log.out( 'Create sound player' );
    }

    duration( name ) {
        let tm = this.SoundPlayer[ name + SoundPlayer.suffix ].time;
        if ( tm == undefined ) tm = 0;
        return tm;
    }

    fileName( name ) {
        return ( name === '' ) ? '' : (SoundPlayer.folder + name + SoundPlayer.suffix);
    }

    /**
     * Запустить проигрывание звукового файла.
     *
     * @param {string} name название звукового файла
     * @param {callable} onEndFunc функция, вызываемая по завершении проигрывания файла
     * @param {object} funcParams параметры, передаваемые функции завершения
     */
    startPlay( name, onEndFunc = null, funcParams = null ) {
        let sound = SoundPlayer.sounds[ name + SoundPlayer.suffix ].sound;
        if ( sound == undefined ) {
            Log.out( 'Not found audio item for ' + name );
            return;
        }
        let soundName = name;
        sound.once( 'end', function(){
            Log.out( 'End play sound "' + soundName + '"' );
            if ( onEndFunc ) onEndFunc( funcParams );
        });
        sound.loop( false );
        sound.mute( this.muteState );
        Log.out( 'Start play sound "' + name + '". Mute is ' + ( this.muteState ? 'true' : 'false' ) );
        sound.play();
    }

    /**
     * Запустить проигрывание звукового файла в цикле.
     *
     * @param {string} name название звукового файла
     */
    playLoop( name ) {
        let sound = SoundPlayer.sounds[ name + SoundPlayer.suffix ].sound;
        if ( sound == undefined ) {
            Log.out( 'Not found audio item for ' + name );
            return;
        }
        sound.loop( true );
        sound.mute( this.muteState );
        Log.out( 'Start loop play "' + name + '". Mute is ' + ( this.muteState ? 'true' : 'false' ) );
        sound.play();
    }

    /**
     * Остановить проигрывание звукового файла.
     *
     * @param {string} name название звукового файла
     */
    stopPlay( name ) {
        let sound = SoundPlayer.sounds[ name + SoundPlayer.suffix ].sound;
        if ( sound == undefined ) {
            Log.out( 'Not found audio item for ' + name );
            return;
        }
        Log.out( 'Stop play ' + name );
        sound.stop();
    }

    /**
     * Получить состояние молчания.
     *
     * @returns {boolean} Возвращает текущее состояние молчания.
     */
    isMuted() {
        Log.out( 'Sound mute is ' + ( this.muteState ? 'true' : 'false' ) );
        return this.muteState;
    }

    /**
     * Установить состояние молчания для всех звуков.
     *
     * @param {boolean} state новое состояние
     */
    setMute( state ) {
        this.muteState = state;
        Log.out( 'Set sound mute to ' + ( this.muteState ? 'true' : 'false' ) );
        let names = Object.keys( SoundPlayer.sounds );
        for ( let i = 0; i < names.length; ++i ) {
            let sound = SoundPlayer.sounds[ names[ i ] ].sound;
            if ( sound != undefined ) {
                sound.mute( state )
            }
        }
    }

    /**
     * Загрузить все звуковые файлы.
     *
     * Загрузка происходит асинхронно. По завершении загрузки возбуждается событие
     * 'downloadFinished'. При ошибке загрузки возбуждается событие 'downloadError'.
     */
    download() {

        let files = Object.keys( SoundPlayer.sounds );
        Log.out( 'Start download sound files: ' + files.length );
        for ( let i = 0; i < files.length; ++i ) {

            let name = files[ i ];

            Log.out( 'Start download sound: ' + name );
            let sound = new Howl({
                src: SoundPlayer.folder + name,
                autoplay: false
            });
            SoundPlayer.sounds[ name ].sound = sound;
            sound.once( 'load', () => {
                let player = SoundPlayer.instance();
                player.downloadCount += 1;
                Log.out( 'Download sound ' + player.downloadCount + ': ' + name );
                if ( player.downloadCount === files.length )
                    player.emit( 'downloadFinished' );
                this.parent.emit('music.progress', player.downloadCount * 100 / files.length);
            });
            sound.once( 'loaderror', ( id, error ) => {
                let player = SoundPlayer.instance();
                player.emit( 'downloadError', {
                    name: name,
                    error: error
                });
            });
            sound.load();
        }
    }
}
