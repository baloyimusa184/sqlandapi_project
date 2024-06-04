document.addEventListener('DOMContentLoaded', () => {
    Alpine.data('app', () => {
        return {
            music: [],

            async init() {
                await this.fetchmusic();
            },
            async fetchmusic() {
                try {
                    const response = await fetch('/api/music');
                    if (!response.ok) {
                        throw new error('failed to fetch music');
                    }
                    const data = await response.json();
                    this.music = data.music;
                }
                catch (error) {
                    console.error(error)
                    ;
                }
            }
        }
    })
});
