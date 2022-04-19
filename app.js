Vue.createApp({
    data() {
        return {
            speakers: [],
            running: false,
            seconds_per_speaker: 120,
            new_speaker_name: '',
            timer: 120,
            timeMinutes: 0,
            timeSeconds: 0,
            verbose: false
        }
    },
    created() {
        window.addEventListener('keydown', this.keydown_handler);
    },
    mounted() {

    },
    destroyed() {
        window.removeEventListener('keydown', this.keydown_handler);
    },
    methods: {
        keydown_handler(e) {
            const key_pressed = e.key;

            const keys = {
                space: ' ',
                enter: 'Enter',
                escape: 'Escape',
                o: 'o',
                v: 'v'
            };

            if (key_pressed === keys.space)
                if (!this.running)
                    this.start_session();
                else
                    this.pause_session();
            else if (key_pressed === keys.enter)
                this.skip_speaker();
            else if (key_pressed === keys.escape)
                this.end_session();
            else if (key_pressed === keys.o)
                this.open_options();
            else if (key_pressed === keys.v)
                this.toggle_verbosity();

            if (this.verbose) {
                console.log(e);
                console.log('You pressed => ' + key_pressed);
            }
        },
        add_speaker() {
            this.speakers.push(this.newSpeaker);
            this.newSpeaker = '';
        },
        update_timer() {
            this
        },
        start_session() {
            if (this.running)
                return;

            this.running = true;
            this.interval = setInterval(this.update_timer(), 1000);
        },
        pause_session() {
            this.running = false;
            console.log('Session PAUSED');
        },
        end_session() {
            console.log('Session ENDED');
        },
        skip_speaker() {
            // go to the next speaker before timer hits 0
            console.log('Speaker SKIPPED');
        },
        switch_mode() {
            console.log('Mode SWITCHED');
        },
        open_options() {
            alert('BOOM, options.');
        },
        toggle_verbosity() {
            this.verbose = !this.verbose;
        }
    }
}).mount('#app')