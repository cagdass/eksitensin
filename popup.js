let page = document.getElementById('leBaslikDiv');
chrome.storage.sync.get('basliklar', data => {
	const { basliklar = [] } = data
	const nasilCanlanir = document.getElementById('le-aciklama');

	// engelli baslik yok hocam.!.
	if (basliklar.length > 0) {
		const yok = document.getElementById('yok');
		yok.parentElement.removeChild(yok);
	} else {
		nasilCanlanir.style.display = 'none';
	}

	for (let baslik of basliklar) {
		let yeniBirDiv = document.createElement('div');
		let baslikButonu = document.createElement('button');
		baslikButonu.innerText = baslik;
		// buton ekle ki suser basligi canlandirabilsin.
		baslikButonu.setAttribute('type', 'button');
		baslikButonu.setAttribute('class', 'baslik-butonu');
		baslikButonu.addEventListener('click', function() {
			chrome.storage.sync.get('basliklar', data => {
				const aktuelBasliklar = data.basliklar || [];
				const index = aktuelBasliklar.indexOf(baslik);
				chrome.storage.sync.set({
					basliklar: [...aktuelBasliklar.slice(0, index),
								...aktuelBasliklar.slice(index+1)]
				}, function() {
					yeniBirDiv.removeChild(baslikButonu);
					page.removeChild(yeniBirDiv);
				})
			});
		});
		yeniBirDiv.appendChild(baslikButonu);
		page.appendChild(yeniBirDiv);
	}
});
