window.onload = function() {
  pesquisaEstado();
}
function pesquisaEstado() { 
var urlestados = `https://servicodados.ibge.gov.br/api/v1/localidades/estados`;
axios.get(urlestados)
.then(function(response){
  return response.data;
})
.then(function(res){
  var mun = document.querySelector("#municipio");
  document.querySelector("#municipio").disabled = true;
  var result = '<option selected value="">Selecione um estado</option>';
  mun.innerHTML = result.replace("estado", "município");
  result += res.map(estados => {
     return `<option value=${estados.id}> ${estados.sigla} </option>`;
  });
  
  var estados = document.querySelector('#estados');
  estados.innerHTML = result;  
   estados.addEventListener("change", function(event){
    event.preventDefault();
    var codEstado = estados.value;
    if(codEstado.length != 0){
      pesquisaMunicipio(codEstado);
      document.querySelector("#municipio").disabled = false;
    }else {
       codEstado.value = '';
    }
     
  })
  
  
  })

.catch(function (error) {
    console.error(error);
});

}

function pesquisaMunicipio(codEstado) { 
  var urlmunicipio = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${codEstado}/municipios`;
  axios.get(urlmunicipio)
  .then(function(response){
    return response.data;
  })
  .then(function(res){
    var mun = document.querySelector("#municipio");
    var result = '<option selected value="">Selecione um município</option>';
    mun.innerHTML =result;
    result += res.map(municipios => {
       return `<option value="${municipios.id}"> ${municipios.nome} </option>`;
    });
  
     var municipios = document.querySelector('#municipio');
     municipios.innerHTML = result;

     var botao = document.querySelector("#search");
     botao.addEventListener("click",function(event){
       event.preventDefault();
       var codMunicipio = municipio.value;
       var anomes = document.querySelector("#data").value;
       if(codMunicipio != '' && anomes != ''){
          pegaData(codMunicipio, anomes);
       }
     })
     
     
  }) 
  .catch(function (error) {
      console.error(error);
  });
  
  }

  function pegaData(codMunicipio, dataRef) {
        var dataTeste = dataRef.replace("-","");
        if(dataTeste === '202001' || dataTeste === '202002' || dataTeste === '202003'){
          alert('A data de referência é partir de abril de 2020');
        }else{
          const urlauxilio = `http://www.transparencia.gov.br/api-de-dados/auxilio-emergencial-por-municipio?mesAno=${dataTeste}&codigoIbge=${codMunicipio}&pagina=1`
         axios.get(urlauxilio, {
           headers:{
            "Accept": "*/*",
            "chave-api-dados": "4700f43de1d125f9dea18ee134888da7"
           },

         }).then(function(response){
           console.log(response.data);
         })
         .catch(function(response){
           alert('O serviço para estar indisponível, por favor tente mais tarde!');
          })
        }
         
      }  

  
  



