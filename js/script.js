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
		var result = '<option selected value="">Selecione um estado</option>';

		var dataCounty = result.replace('estado', 'município');
		var mun = document.querySelector("#county");
		mun.innerHTML = dataCounty;
		mun.disabled = true;
		result += res.map(states => {
			return `<option value=${states.id}> ${states.sigla} </option>`;
		});

		var states = document.querySelector('#states');
		states.innerHTML = result;
		states.addEventListener("click", function (event) {
			event.preventDefault();
			var stateCode = states.value;
			if (!!stateCode) {
				municipalitySearch(stateCode);
			} else {
				stateCode.value = '';
				mun.innerHTML = dataCounty;
				mun.disabled = true;
			}
		});
	});

}

function municipalitySearch(stateCode) {
	var url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios`;
	const request = requestApi(url);

	request.then((res) => {
		var result = '<option selected value="">Selecione um município</option>';
		result += res.map(counties => {
			return `<option value="${counties.id}"> ${counties.nome} </option>`;
		});

		var counties = document.querySelector('#county');
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
        <div class="close">
            <button class="close">&times;</button>
        </div>
        <div>
            <h2>Auxílio Emergencial por município</h2>
        </div>
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
            <input type="text"
                value="${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dataList[0].valor)}"
                disabled>
        </div>
        <div class="container">
            <button type="button" class="back">Voltar</button>
        </div>
    </div>
          `;
				var modal = document.querySelector('#showModal');
				modal.innerHTML = listModal;
				modal.style.display = 'flex';

				var btnClose = document.querySelector('.close');
				var btnBack = document.querySelector('.back');

				btnClose.addEventListener("click", function (event) {
					event.preventDefault();
					modal.style.display = 'none';
				});

				btnBack.addEventListener("click", function (event) {
					event.preventDefault();
					modal.style.display = 'none';
				});
			}

		});
	}

}






