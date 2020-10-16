window.onload = function () {
	stateSearch();
}

async function requestApi(url, option) {

	const resp = await axios(url, option);

	return resp.data;
}

function stateSearch() {
	var url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados`;
	const request = requestApi(url);
	request.then((res) => {
		var mun = document.querySelector("#municipio");
		mun.disabled = true;
		var result = '<option selected value="">Selecione um estado</option>';
		result += res.map(states => {
			return `<option value=${states.id}> ${states.sigla} </option>`;
		});

		var states = document.querySelector('#estados');
		states.innerHTML = result;
		states.addEventListener("change", function (event) {
			event.preventDefault();
			var stateCode = states.value;
			if (!!stateCode) {
				municipalitySearch(stateCode);
			} else {
				stateCode.value = '';
			}
		});
	});

}

function municipalitySearch(stateCode) {
	var url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios`;
	const request = requestApi(url);

	request.then((res) => {
		var result = '<option selected value="">Selecione um município</option>';
		var mun = document.querySelector("#municipio");
		result += res.map(counties => {
			return `<option value="${counties.id}"> ${counties.nome} </option>`;
		});
		mun.innerHTML = result;

		var counties = document.querySelector('#municipio');
		counties.disabled = false;
		counties.innerHTML = result;

		var button = document.querySelector("#search");
		button.addEventListener("click", function (event) {
			event.preventDefault();
			var codCounties = counties.value;
			if (!!codCounties) {
				getDate(codCounties);
			}
		});
	})
		.catch(function (error) {
			console.error(error);
		});

}

async function getDate(codCounties) {

	const options = {
		headers: {
			"Accept": "*/*",
			"chave-api-dados": "4700f43de1d125f9dea18ee134888da7"
		},
	}

	var date = document.querySelector('#data').value;
	date = date.replace('-', '');

	var finalDate = Number(date);

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
		await request.then(function (res) {
			dataList[0].municipio = res[0].municipio.nomeIBGE;
			dataList[0].nomeIBGE = res[0].municipio.uf.nome;
			dataList[0].valor += res[0].valor;
			dataList[0].quantidadeBenificiados += res[0].quantidadeBeneficiados;

			if (i == finalDate) {
				var listModal = `
      <div class="modal-content">
          <span class="close">&times;</span>
          <div class="container">
              <label for="est">Estado</label>
              <input type="text" value="${dataList[0].nomeIBGE}" disabled>
          </div>
          <div class="container">
              <label for="mun">Município</label>
              <input type="text" value="${dataList[0].municipio}" disabled>
          </div>
          <div class="container">
              <label for="qtd">Quantidade de beneficiados</label>
              <input type="text" value="${dataList[0].quantidadeBenificiados}" disabled>
          </div>
          <div class="container">
              <label for="val">Valor total</label>
              <input type="text" value="${dataList[0].valor}" disabled>
          </div>
          <div class="container">
        	<button type="button" class="close">Voltar</button>
          </div>
      </div>
          `;
				var modal = document.querySelector('#showModal');
				modal.innerHTML = listModal;
				modal.style.display = 'block';

				var btnClose = document.querySelector('.close');

				btnClose.addEventListener("click", function (event) {
					event.preventDefault();
					modal.style.display = 'none';
				});

				console.log(showModal);
			}

		});
	}

}






