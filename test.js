const _0x34d784=_0x3480;function _0x4573(){const _0x277f0f=['innerText','241560gYneeG','getElementById','1538901UpuslK','6HvTjgE','resposta','2029476nWXXAu','btnEnviar','107815Mtjodr','39705ymwYEb','176JBQTiE','addEventListener','1123213QpgkXw','inputTexto','1886230fkXqmp','completion','value','450nyutYO'];_0x4573=function(){return _0x277f0f;};return _0x4573();}(function(_0x537a28,_0x4f6794){const _0x1000ce=_0x3480,_0x1ac444=_0x537a28();while(!![]){try{const _0x5853ea=parseInt(_0x1000ce(0x137))/0x1*(parseInt(_0x1000ce(0x145))/0x2)+parseInt(_0x1000ce(0x144))/0x3+-parseInt(_0x1000ce(0x147))/0x4+parseInt(_0x1000ce(0x138))/0x5*(parseInt(_0x1000ce(0x140))/0x6)+parseInt(_0x1000ce(0x13b))/0x7+-parseInt(_0x1000ce(0x139))/0x8*(parseInt(_0x1000ce(0x142))/0x9)+-parseInt(_0x1000ce(0x13d))/0xa;if(_0x5853ea===_0x4f6794)break;else _0x1ac444['push'](_0x1ac444['shift']());}catch(_0x10448f){_0x1ac444['push'](_0x1ac444['shift']());}}}(_0x4573,0x4ab36));async function enviarPrompt(_0x36baec){const _0xfdd48a=_0x3480,_0x220bd5=await fetch('https://api.anthropic.com/v1/complete',{'method':'POST','headers':{'Content-Type':'application/json','x-api-key':'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'},'body':JSON['stringify']({'model':'claude-3','prompt':_0x36baec,'max_tokens_to_sample':0x12c})}),_0x41d4a7=await _0x220bd5['json']();return _0x41d4a7[_0xfdd48a(0x13e)];}function _0x3480(_0x595fdd,_0x1a1d6b){const _0x4573a6=_0x4573();return _0x3480=function(_0x348004,_0x2a49c7){_0x348004=_0x348004-0x136;let _0x30a986=_0x4573a6[_0x348004];return _0x30a986;},_0x3480(_0x595fdd,_0x1a1d6b);}document[_0x34d784(0x143)](_0x34d784(0x136))[_0x34d784(0x13a)]('click',async()=>{const _0x5a619a=_0x34d784,_0x3586b7=document[_0x5a619a(0x143)](_0x5a619a(0x13c))[_0x5a619a(0x13f)],_0x56aa97=await enviarPrompt(_0x3586b7);document['getElementById'](_0x5a619a(0x146))[_0x5a619a(0x141)]=_0x56aa97;});
/*
async function enviarPrompt(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': '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'  
    },
    body: JSON.stringify({
      model: 'claude-3',
      prompt: prompt,
      max_tokens_to_sample: 300
    })
  });
  const data = await response.json();
  return data.completion;
}

document.getElementById('btnEnviar').addEventListener('click', async () => {
  const input = document.getElementById('inputTexto').value;
  const resposta = await enviarPrompt(input);
  document.getElementById('resposta').innerText = resposta;
});
*/
