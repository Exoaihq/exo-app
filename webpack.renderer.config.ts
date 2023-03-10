import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.(sass|less|css)$/,
  use: [{ loader: 'style-loader' },
  {
    loader: 'css-loader', options: {
      sourceMap: true
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    },

  }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
