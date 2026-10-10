import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { createStore, ValidationError } from './domain.mjs';

export function createServer(store) {
  const publicDir=join(dirname(fileURLToPath(import.meta.url)),'public');
  return http.createServer(async(req,res)=>{
    const send=(status,body)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(body));};
    try {
      const path=new URL(req.url,'http://localhost').pathname;
      if(path.startsWith('/api/')) {
        if(!['GET','POST'].includes(req.method))return send(405,{error:'Método não permitido.'});
        if(req.method==='POST') {
          if(req.headers.origin && req.headers.origin!==`http://${req.headers.host}`)return send(403,{error:'Origem não permitida.'});
          if(!req.headers['content-type']?.startsWith('application/json'))return send(415,{error:'Envie JSON.'});
        }
        let body={};if(req.method==='POST'){let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>16000)throw new ValidationError('Pedido muito grande.',413);}try{body=JSON.parse(raw);}catch{throw new ValidationError('JSON inválido.',400);}if(!body||typeof body!=='object'||Array.isArray(body))throw new ValidationError('Objeto JSON esperado.',400);}
        if(req.method==='GET' && path==='/api/units')return send(200,store.listUnits());
        if(req.method==='POST' && path==='/api/units')return send(201,store.addUnit(body));
        if(req.method==='GET' && path==='/api/reservations')return send(200,store.listReservations());
        if(req.method==='POST' && path==='/api/reservations')return send(201,store.reserve(body));
        const cancel=path.match(/^\/api\/reservations\/([\w-]+)\/cancel$/);if(req.method==='POST'&&cancel){store.cancel(cancel[1]);return send(200,{ok:true});}
        return send(404,{error:'Rota não encontrada.'});
      }
      if(req.method!=='GET')return send(405,{error:'Método não permitido.'});
      const assets={'/':['index.html','text/html'],'/app.js':['app.js','text/javascript'],'/style.css':['style.css','text/css']};
      if(!assets[path])return send(404,{error:'Página não encontrada.'});
      const [file,type]=assets[path];const data=await readFile(join(publicDir,file));res.writeHead(200,{'Content-Type':`${type}; charset=utf-8`,'X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'"});res.end(data);
    }catch(e){if(!(e instanceof ValidationError))console.error(e);send(e.status||500,{error:e instanceof ValidationError?e.message:'Erro interno ao processar o pedido.'});}
  });
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const dir=join(dirname(fileURLToPath(import.meta.url)),'data');await mkdir(dir,{recursive:true});
  const store=createStore(join(dir,'comercial.sqlite'));const server=createServer(store);
  server.listen(Number(process.env.PORT||3210),'127.0.0.1',()=>console.log(`Comercial: http://127.0.0.1:${server.address().port}`));
  const close=()=>server.close(()=>{store.close();process.exit(0);});process.on('SIGINT',close);process.on('SIGTERM',close);
}
