document.addEventListener('DOMContentLoaded', function () {
  let _url = "https://my-json-server.typicode.com/adosetiawan/belajar-pwa/product";

  let dataResult = '';

  let catResult = '<option value="semua">semua</option>';

  let cateGories = [];
  let selectcat = document.querySelector('#select-product');
  let product = document.querySelector('#product');

  function renderPage(data) {
    data.forEach(barang => {
      dataResult += `<div class="form-group">
                                <h3>${barang.nama}<h3>
                                <span class="badge badge-info">${barang.kategori}</span>
                            </div>`;

      let cat = barang.kategori;
      if (cateGories.includes(cat) == false) {
        cateGories.push(cat);
        catResult += `<option value="${cat}">${cat}</option>`;
      }

    });
    selectcat.innerHTML = catResult;
    product.innerHTML = dataResult;
  }

  //fresh data from online

  let networkDataResive = false;
  let networkUpdate = fetch(_url).then(function (response) {
    return response.json()
  }).then(function (data) {
    networkDataResive = true;
    renderPage(data);
  });


  //return data from cache

  caches.match(_url).then(function (response) {
    if (!response) throw Error('No data on Cache')
    return response.json();
  }).then(function (data) {
    if (!networkDataResive) {
      renderPage(data);
      console.log('render data from cache');
    }
  }).catch(function () {
    return networkUpdate;
  })


  selectcat.addEventListener('change', (event) => {
    let value = event.target.value;
    let _newUrl = `https://my-json-server.typicode.com/adosetiawan/belajar-pwa/product?kategori=${value}`;

    let dataResult = '';
    let product = document.querySelector('#product');
    let ajax = new XMLHttpRequest();
    ajax.onload = function () {
      if (ajax.status === 200) {
        const respon = JSON.parse(ajax.responseText);
        respon.forEach(barang => {
          dataResult += `<div class="form-group">
                                        <h3>${barang.nama}<h3>
                                        <span class="badge badge-info">${barang.kategori}</span>
                                    </div>`;
        });
        product.innerHTML = dataResult;
      } else {
        console.log('gagal');
      }
    }
    ajax.open('GET', _newUrl);
    ajax.send();
  });

});



//pwa
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/pwa/service-worker.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

