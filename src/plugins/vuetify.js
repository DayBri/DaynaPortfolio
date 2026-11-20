import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

export default createVuetify({
  // SVG icons from @mdi/js: only the icons you import are bundled.
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: {
    defaultTheme: 'portfolio',
    themes: {
      portfolio: {
        dark: false,
        colors: {
          primary: '#1d2433',
          secondary: '#2a9d8f',
          surface: '#ffffff',
          'on-surface': '#1d2433',
        },
      },
    },
  },
  defaults: {
    VBtn: { variant: 'flat' },
    VChip: { size: 'small', variant: 'tonal' },
  },
});
