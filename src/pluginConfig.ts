import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-wave-buoys-fr',
    version: '0.1.0',
    title: 'Wave Buoys (FR)',
    icon: '🌊',
    description: 'This plugin gives the wave buoys data from CEREMA.',
    author: 'Edouard Gauvrit',
    repository: 'git+https://github.com/windycom/windy-plugins.git',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    desktopWidth: 600,
    //routerPath: '/wave-buoys-fr',

    // Default width of rhpane plugins is 400px, but you can change it
    //desktopWidth: 1000,
};

export default config;