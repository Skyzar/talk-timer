Vue.createApp({
    data() {
        return {
            speakers: [
                {
                    name: 'Speaker 1',
                    tag: 'tech',
                },
                {
                    name: 'Speaker 2',
                    tag: 'tech',
                },
                {
                    name: 'Speaker 3',
                    tag: 'phy',
                },
                {
                    name: 'Speaker 4',
                    tag: 'math',
                },
                {
                    name: 'Speaker 5',
                    tag: 'tech',
                },
                {
                    name: 'Speaker 6',
                    tag: 'bio',
                },
            ],
            speaker_name_sorting_asc: true,
            speaker_tag_sorting_asc: true,
            active_speaker: '',
            active_speaker_index: 0,
            running: false,
            seconds_per_speaker: 10,
            new_speaker_name: '',
            import_speakers_text: '',
            timer: 10,
            display_seconds: 0,
            display_minutes: 0,
            verbose: false,
            show_options: false,
            show_import: false,
            show_export: false,
            interval: null,
        };
    },
    created() {
        window.addEventListener('keydown', this.keydown_handler);

        if (this.speakers.length > 0) this.active_speaker = this.speakers[0];

        this.update_display();
    },
    destroyed() {
        window.removeEventListener('keydown', this.keydown_handler);
    },
    watch: {
        seconds_per_speaker(new_value) {
            this.timer = new_value;
            this.update_display();
        },
    },
    computed: {
        export_text() {
            let text = '';
            for(let speaker of this.speakers)
                text += `${speaker.name || ''},${speaker.tag || ''}\n`;
            return text;
        },
    },
    methods: {
        select_export(event) {
            event.target.focus();
            event.target.select();
        },
        get_top() {
            const px = 98 - this.active_speaker_index * 46;
            return `top: ${px}px;`;
        },
        get_class_name(index) {
            let diff = index - this.active_speaker_index;

            if (diff > 6) diff = 6;
            if (diff < -6) diff = -6;

            if (diff < 0) return `past p${Math.abs(diff)}`;
            else if (diff > 0) return `future p${diff}`;
            else return 'active';
        },
        keydown_handler(e) {
            const key_pressed = e.key;
            const ctrl_pressed = e.ctrlKey;

            const keys = {
                space: ' ',
                arrow_up: 'ArrowUp',
                arrow_down: 'ArrowDown',
                arrow_left: 'ArrowLeft',
                arrow_right: 'ArrowRight',
                escape: 'Escape',
                o: 'o',
                e: 'e',
                i: 'i'
            };

            if (key_pressed === keys.space)
                if (!this.running) this.start_session();
                else this.pause_session();
            else if (key_pressed === keys.arrow_left || key_pressed === keys.arrow_up) this.previous_speaker();
            else if (key_pressed === keys.arrow_right || key_pressed === keys.arrow_down) this.next_speaker();
            else if (key_pressed === keys.escape) this.hide_everything();
            else if (ctrl_pressed && key_pressed === keys.o) {
                e.preventDefault();
                this.toggle_options();
            } else if (ctrl_pressed && key_pressed === keys.i) {
                e.preventDefault();
                this.show_options ? this.toggle_import() : false;
            } else if (ctrl_pressed && key_pressed === keys.e) {
                e.preventDefault();
                this.show_options ? this.toggle_export() : false;
            }

            if (this.verbose) {
                console.log(e);
                console.log('You pressed => ' + key_pressed);
            }
        },
        import_speakers() {
            this.speakers = [];
            const values = this.import_speakers_text.split('\n');

            for (let i = 0; i < values.length; i++){
                const value = values[i];

                if(!value.includes(','))
                    continue;

                let speaker = value.split(',');
                this.speakers.push({
                    name: speaker[0]?.trim(),
                    tag: speaker[1]?.trim()
                });
            }

            this.import_speakers_text = '';
            this.show_import = false;
        },
        add_speaker() {
            if (this.new_speaker_name === '') return;

            this.speakers.push({
                name: this.new_speaker_name,
                tag: '',
            });
            this.new_speaker_name = '';
        },
        update_speaker(event, index) {
            this.speakers[index] = event.target.value;
            console.log(event, index);
        },
        remove_speaker(index) {
            this.speakers.splice(index, 1);
        },
        remove_all_speakers() {
            if (confirm('Delete all speakers?')) this.speakers = [];
        },
        next_second() {
            this.timer -= 1;

            if (this.timer <= 0) this.next_speaker();

            this.update_display();
        },
        start_session() {
            if (this.running) return;

            this.running = true;
            this.interval = setInterval(this.next_second, 1000);
        },
        pause_session() {
            if (!this.running) return;

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
            if (this.active_speaker_index === 0) return;
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
            this.display_minutes = Math.floor(this.timer / 60)
                .toString()
                .padStart(2, '0');
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
        sort_speakers_by_name() {

            this.speakers.sort((a, b) => {
                return this.speaker_name_sorting_asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            });
            this.speaker_name_sorting_asc = !this.speaker_name_sorting_asc;
        },
        sort_speakers_by_tag() {
            this.speakers.sort((a, b) => {
                return this.speaker_tag_sorting_asc ? a.tag.localeCompare(b.tag) : b.tag.localeCompare(a.tag);
            });
            this.speaker_tag_sorting_asc = !this.speaker_tag_sorting_asc;
        },
        toggle_options() {
            this.pause_session();
            this.show_options ? this.hide_everything() :
            this.show_options = !this.show_options;
        },
        toggle_import() {
            this.show_export = false;
            this.show_import = !this.show_import;
        },
        toggle_export() {
            this.show_import = false;
            this.show_export = !this.show_export;
        },
        toggle_verbosity() {
            this.verbose = !this.verbose;
        },
        hide_everything() {
            this.show_options = false;
            this.show_import = false;
            this.show_export = false;
        }
    },
}).mount('#app');

/*
TODO's
- Export variants: csv (or other char of choise), json
- Help Dialogs
- Sizing options
- Code cleanup
 */