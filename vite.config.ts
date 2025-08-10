import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pearde.lol/',   // ровно имя репы, с двумя слэшами по краям
})