/**
 * rollup配置，自己查吧。
 */

import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import cleaner from 'rollup-plugin-cleaner';
import { version, main } from './package.json';

export default {
    input: main,
    output: {
        file: `lib/HoanSocket-${version}.js`,
        format: 'umd',
        name: 'HoanSocket',
        sourcemap: true
    },
    context: 'this',
    plugins: [
        json(),
        resolve(),
        cleaner({
            targets: [
                './lib/'
            ]
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        process.env.ENV === 'prod' && uglify()
    ]
};