import { createDefaultEsmPreset } from 'ts-jest'

const presetConfig = createDefaultEsmPreset()

export default {
  ...presetConfig,
  testEnvironment: 'node',
  // Kasih tau Jest kalau ~/ itu lari ke folder src
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1', // Tetap simpan ini buat support ESM
  },
  // Pastiin rootDir-nya bener
  rootDir: '.',
}
