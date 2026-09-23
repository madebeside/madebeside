import {defineConfig} from 'vite';
export default defineConfig({root:'client',base:'/market/',build:{outDir:'../web/market',emptyOutDir:true,target:'es2022',cssCodeSplit:true},server:{host:'127.0.0.1',port:5173,proxy:{'/api':'http://127.0.0.1:4173','/media':'http://127.0.0.1:4173','/fonts':'http://127.0.0.1:4173'}}});
