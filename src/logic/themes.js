export default function themes() {
    const THEMES = {
        1: {
            name: 'zync',
            color: '#000',
            props: {
                '--background': '0 0% 100%',
                '--foreground': '240 10% 3.9%',
                '--card': '0 0% 100%',
                '--card-foreground': '240 10% 3.9%',
                '--popover': '0 0% 100%',
                '--popover-foreground': '240 10% 3.9%',
                '--primary': '240 5.9% 10%',
                '--primary-foreground': '0 0% 98%',
                '--secondary': '240 4.8% 95.9%',
                '--secondary-foreground': '240 5.9% 10%',
                '--muted': '240 4.8% 95.9%',
                '--muted-foreground': '240 3.8% 46.1%',
                '--accent': '240 4.8% 95.9%',
                '--accent-foreground': '240 5.9% 10%',
                '--destructive': '0 84.2% 60.2%',
                '--destructive-foreground': '0 0% 98%',
                '--border': '240 5.9% 90%',
                '--input': '240 5.9% 90%',
                '--ring': '240 5.9% 10%',
                '--radius': '0.5rem'
            }
        },
        2: {
            name: 'rose',
            color: '#e11d48',
            props: {
                '--background': '0 0% 100%',
                '--foreground': '240 10% 3.9%',
                '--card': '0 0% 100%',
                '--card-foreground': '240 10% 3.9%',
                '--popover': '0 0% 100%',
                '--popover-foreground': '240 10% 3.9%',
                '--primary': '346.8 77.2% 49.8%',
                '--primary-foreground': '355.7 100% 97.3%',
                '--secondary': '240 4.8% 95.9%',
                '--secondary-foreground': '240 5.9% 10%',
                '--muted': '240 4.8% 95.9%',
                '--muted-foreground': '240 3.8% 46.1%',
                '--accent': '240 4.8% 95.9%',
                '--accent-foreground': '240 5.9% 10%',
                '--destructive': '0 84.2% 60.2%',
                '--destructive-foreground': '0 0% 98%',
                '--border': '240 5.9% 90%',
                '--input': '240 5.9% 90%',
                '--ring': '346.8 77.2% 49.8%',
                '--radius': '0.5rem'
            }
        },
        3: {
            name: 'blue',
            color: '#3b82f6',
            props: {
                '--background': '0 0% 100%',
                '--foreground': '222.2 84% 4.9%',
                '--card': '0 0% 100%',
                '--card-foreground': '222.2 84% 4.9%',
                '--popover': '0 0% 100%',
                '--popover-foreground': '222.2 84% 4.9%',
                '--primary': '221.2 83.2% 53.3%',
                '--primary-foreground': '210 40% 98%',
                '--secondary': '210 40% 96.1%',
                '--secondary-foreground': '222.2 47.4% 11.2%',
                '--muted': '210 40% 96.1%',
                '--muted-foreground': '215.4 16.3% 46.9%',
                '--accent': '210 40% 96.1%',
                '--accent-foreground': '222.2 47.4% 11.2%',
                '--destructive': '0 84.2% 60.2%',
                '--destructive-foreground': '210 40% 98%',
                '--border': '214.3 31.8% 91.4%',
                '--input': '214.3 31.8% 91.4%',
                '--ring': '221.2 83.2% 53.3%',
                '--radius': '0.5rem'
            }
        },
        4: {
            name: 'green',
            color: '#16a34a',
            props: {
                '--background': '0 0% 100%',
                '--foreground': '240 10% 3.9%',
                '--card': '0 0% 100%',
                '--card-foreground': '240 10% 3.9%',
                '--popover': '0 0% 100%',
                '--popover-foreground': '240 10% 3.9%',
                '--primary': '142.1 76.2% 36.3%',
                '--primary-foreground': '355.7 100% 97.3%',
                '--secondary': '240 4.8% 95.9%',
                '--secondary-foreground': '240 5.9% 10%',
                '--muted': '240 4.8% 95.9%',
                '--muted-foreground': '240 3.8% 46.1%',
                '--accent': '240 4.8% 95.9%',
                '--accent-foreground': '240 5.9% 10%',
                '--destructive': '0 84.2% 60.2%',
                '--destructive-foreground': '0 0% 98%',
                '--border': '240 5.9% 90%',
                '--input': '240 5.9% 90%',
                '--ring': '142.1 76.2% 36.3%',
                '--radius': '0.5rem'
            }
        },
        5: {
            name: 'orange',
            color: '#f97316',
            props: {
                '--background': '0 0% 100%',
                '--foreground': '20 14.3% 4.1%',
                '--card': '0 0% 100%',
                '--card-foreground': '20 14.3% 4.1%',
                '--popover': '0 0% 100%',
                '--popover-foreground': '20 14.3% 4.1%',
                '--primary': '24.6 95% 53.1%',
                '--primary-foreground': '60 9.1% 97.8%',
                '--secondary': '60 4.8% 95.9%',
                '--secondary-foreground': '24 9.8% 10%',
                '--muted': '60 4.8% 95.9%',
                '--muted-foreground': '25 5.3% 44.7%',
                '--accent': '60 4.8% 95.9%',
                '--accent-foreground': '24 9.8% 10%',
                '--destructive': '0 84.2% 60.2%',
                '--destructive-foreground': '60 9.1% 97.8%',
                '--border': '20 5.9% 90%',
                '--input': '20 5.9% 90%',
                '--ring': '24.6 95% 53.1%',
                '--radius': '0.5rem'
            }
        }
    };

    async function setTheme(colorId) {
        const theme = THEMES[colorId]?.props;
        if (!theme) return;

        Object.keys(theme).forEach((key) => {
            document.documentElement.style.setProperty(key, theme[key]);
        });
    }

    async function getThemes() {
        const themes = [];
        Object.keys(THEMES).forEach((key) => {
            themes.push({key: key, name: THEMES[key].name, color: THEMES[key].color});
        });
        return themes;
    }

    return {
        setTheme,
        getThemes
    };
}
