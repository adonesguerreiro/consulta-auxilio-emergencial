window.onload = function () {
  stateSearch();
  
}

async function requestApi(url, option) {

  const resp = await axios(url, option);

  return resp.data;
}

function stateSearch() {
  var url = `https://servicodados.ibge.gov.br/api/v1/localidades/states`;
  const request = requestApi(url);

  request.then((res) => {
    var mun = document.querySelector("#municipio");
    document.querySelector("#municipio").disabled = true;
    var result = '<option selected value="">Selecione um state</option>';
    mun.innerHTML = result.replace("state", "município");
    result += res.map(states => {
      return `<option value=${states.id}> ${states.sigla} </option>`;
    });

    var states = document.querySelector('#states');
    states.innerHTML = result;
    states.addEventListener("change", function (event) {
      event.preventDefault();
      var stateCode = states.value;
      if (stateCode.length != 0) {
        municipalitySearch(stateCode);
        document.querySelector("#municipio").disabled = false;
      } else {
        stateCode.value = '';
      }

    })


  })

    .catch(function (error) {
      console.error(error);
    });

}

function municipalitySearch(stateCode) {
  var url = `https://servicodados.ibge.gov.br/api/v1/localidades/states/${stateCode}/municipios`;
  const request = requestApi(url);

  request.then((res) => {
    var mun = document.querySelector("#municipio");
    var result = '<option selected value="">Selecione um município</option>';
    mun.innerHTML = result;
    result += res.map(counties => {
      return `<option value="${counties.id}"> ${counties.nome} </option>`;
    });

    var counties = document.querySelector('#municipio');
    counties.innerHTML = result;

    var button = document.querySelector("#search");
    button.addEventListener("click", function (event) {
      event.preventDefault();
      var codCounties = counties.value;
      var mesAno = document.querySelector("#data").value;
      if (codCounties != '' && mesAno != '') {
        getDate(codCounties, anomes);
      }
    })
  })
    .catch(function (error) {
      console.error(error);
    });

}

function getDate(codCounties) {

  const options = {
    headers: {
      "Accept": "*/*",
      "chave-api-dados": "4700f43de1d125f9dea18ee134888da7"
    },
  }

  var date = document.querySelector('#data').value;
  date = date.replace('-', '');

  var finalDate = Number(data);

  var dataList = [{
    "municipio": {
      "nomeIBGE": '',
      "uf": {
        "nome": ''
      }
    },
    "valor": 0,
    "quantidadeBenificiados": 0
  }]

  for (var i = 202004; i <= finalDate; i++) {

    const url = `http://www.transparencia.gov.br/api-de-dados/auxilio-emergencial-por-municipio?mesAno=${i}&codigoIbge=${codCounties}&pagina=1`

    const request = requestApi(url, options);
    request.then(function (res) {
      dataList[0].municipio = res[0].municipio.nomeIBGE;
      dataList[0].nomeIBGE = res[0].municipio.uf.nome;
      dataList[0].valor += res[0].valor;
      dataList[0].quantidadeBenificiados += res[0].quantidadeBeneficiados;

      console.log(dataList[0].municipio);
      console.log(dataList[0].nomeIBGE);
      console.log(dataList[0].valor);
      console.log(dataList[0].quantidadeBenificiados);

    });
  }

}




