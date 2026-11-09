import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  // theme: {
  //   options: {
  //     customProperties: true,
  //   },
  //   themes: {
  //     light: {
  //       primary: '#EAEFEF',
  //       secondary: '#BFC9D1',
  //       tertiary: '#25343F',
  //       quaternary: '#FF9B51',
  //     },
  //   },
  // },
  theme: {
    dark: true,
    options: { customProperties: true },
    themes: {
      dark: {
        primary: '#FF4B1F',  
        secondary: '#FFFFFF',
        accent: '#FF4B1F',
        info: '#FF4B1F',
        success: '#3DDC84',
        warning: '#FFB020',
        error: '#FF5252',
        background: '#000000',
        surface: '#121212'
      }
    }
  }
});
