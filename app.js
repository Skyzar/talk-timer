Vue.createApp({
    data() {
        return {
            speakers: [
                "Keanu Reeves 0",
                "Keanu Reeves 1",
                "Keanu Reeves 2",
                "Keanu Reeves 3",
                "Keanu Reeves 4",
                "Keanu Reeves 5",
                "Keanu Reeves 6",
                "Keanu Reeves 7",
                "Keanu Reeves 8",
                "Keanu Reeves 9",
                "Keanu Reeves 10",
                "Keanu Reeves 11"
            ],
            active_speaker: '',
            active_speaker_index: 0,
            running: false,
            seconds_per_speaker: 3,
            new_speaker_name: '',
            timer: 3,
            display_seconds: 0,
            display_minutes: 0,
            verbose: false,
            interval: null
        }
    },
    created() {
        window.addEventListener('keydown', this.keydown_handler);

        if (this.speakers.length > 0)
            this.active_speaker = this.speakers[0]

        this.update_display();
    },
    destroyed() {
        window.removeEventListener('keydown', this.keydown_handler);
    },
    methods: {
        get_top() {
            const px = 98 - (this.active_speaker_index * 46);
            return `top: ${px}px;`
        },
        get_class_name(index) {
            let diff = index - this.active_speaker_index;

            if (diff > 6)
                diff = 6
            if (diff < -6)
                diff = -6

            if (diff < 0)
                return `past p${Math.abs(diff)}`;
            else if (diff > 0)
                return `future p${diff}`;
            else
                return 'active';
        },
        keydown_handler(e) {
            const key_pressed = e.key;

            const keys = {
                space: ' ',
                arrow_left: 'ArrowLeft',
                arrow_right: 'ArrowRight',
                escape: 'Escape',
                o: 'o',
                v: 'v'
            };

            if (key_pressed === keys.space)
                if (!this.running)
                    this.start_session();
                else
                    this.pause_session();
            else if (key_pressed === keys.arrow_left)
                this.previous_speaker();
            else if (key_pressed === keys.arrow_right)
                this.next_speaker();
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
        next_second() {
            this.timer -= 1;

            if (this.timer <= 0)
                this.next_speaker();

            this.update_display();
        },
        start_session() {
            console.log('starting');

            if (this.running)
                return;

            this.running = true;
            this.interval = setInterval(this.next_second, 1000);
        },
        pause_session() {
            if (!this.running)
                return;

            this.running = false;
            clearInterval(this.interval);
        },
        end_session() {
            this.pause_session();

            this.timer = this.seconds_per_speaker;

            this.active_speaker_index = 0;
            this.active_speaker = this.speakers[this.active_speaker_index];
        },
        previous_speaker() {
            if (this.active_speaker_index === 0)
                return;
            this.active_speaker_index -= 1;
            this.active_speaker = this.speakers[this.active_speaker_index];

            this.check_mid_interval();
            this.update_display();
        },
        next_speaker() {
            if (this.active_speaker_index === this.speakers.length - 1) {
                this.end_session();
                return;
            }
            this.active_speaker_index += 1;
            this.active_speaker = this.speakers[this.active_speaker_index];

            this.check_mid_interval();
            this.update_display();
        },
        update_display() {
            this.display_seconds = (this.timer % 60).toString().padStart(2, '0');
            this.display_minutes = Math.floor(this.timer / 60).toString().padStart(2, '0');
        },
        check_mid_interval() {
            // give the next speaker the full initial second instead of less
            // when skipping to the next speaker mid-interval
            if (this.running) {
                this.pause_session();
                this.timer = this.seconds_per_speaker;
                this.start_session();
            }
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