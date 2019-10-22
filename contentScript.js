function domChange(event) {
	if (event.relatedNode.getAttribute('id') === 'partial-index') {
		baslicoust();
	}
};

document.addEventListener('DOMNodeInserted', domChange);

init_stuff();

function baslicoust() {
	chrome.storage.sync.get('basliklar', data => {
		// engellenmis olan tu kaka basliklar. || [] sintaktik sekerim. inisil.
		const basliklar_init = data.basliklar || [];

		// sol framedeki basliklar
		const solFrame = document.querySelector('ul.topic-list.partial');
		if (solFrame) {
			const solFrameBasliklar_ = solFrame.querySelectorAll('li > a');
			[...solFrameBasliklar_].forEach(solFrameBaslik => {
				const solFrameBaslikStr = solFrameBaslik.innerText.split('\n')[0].trim();
				if (basliklar_init.indexOf(solFrameBaslikStr) !== -1) {
					solFrameBaslik.style.display = 'none';
				}
			});
		}
	});
};

function init_stuff() {
	chrome.storage.sync.get('basliklar', data => {
		// engellenmis olan tu kaka basliklar. || [] sintaktik sekerim. inisil.
		const basliklar_init = data.basliklar || [];

		// sol framedeki basliklar
		const solFrame = document.querySelector('ul.topic-list.partial');
		const solFrameBasliklar_ = solFrame.querySelectorAll('li > a');
		[...solFrameBasliklar_].forEach(solFrameBaslik => {
			const solFrameBaslikStr = solFrameBaslik.innerText.split('\n')[0].trim();
			if (basliklar_init.indexOf(solFrameBaslikStr) !== -1) {
				solFrameBaslik.style.display = 'none';
			}
		});

		// esas sayfada baslikla alakali butonlarin yatay duzlemde siralandigi bolge.
		const baslikOptions = document.querySelector('div.sub-title-menu');
		// basligin sergilendigi eleman, h1, bu haliyle atiliyor listeye.
		// basligin ne oldugunu buradan anlayacagim sanirim.
		const baslikH1 = document.querySelector('h1#title');
		// devler bu atributu degistirirse is yas.
		const baslikStr = baslikH1.getAttribute('data-title');

		// sayfaya eklenecek olan baslik engellemece butonunun yaradilisi.
		// bu iktibas bug degil ugur getirsin.
		/*
		 *  "And olsun biz insanı (Âdemi)
		 *  çamurdan (süzülmüş) bir hulâsadan
		 *  yarattık." (Mü'minun, 23/12)
		 *
		 */
		const block_div = document.createElement('div');
		const block_div_a = document.createElement('a');
		// bkz. baslik burada adeta bir string. butona ilistiriliyor.
		block_div_a.value = baslikStr;
		block_div_a.id = 'baslik-engellemeli-buton';

		if (basliklar_init.indexOf(baslikStr) === -1) {
			block_div_a.title = 'bu başlık sol framede görünmesin lütfen';
			block_div_a.innerHTML = 'başlığı engelle';
		}
		// baslik zaten engellenmisse engelle demenin alemi yok.
		else {
			block_div_a.title = 'bu gözler bu başlığı sol framede görse olur artık';
			block_div_a.innerHTML = 'başlığı engelleme';
		};

		block_div_a.addEventListener('click', () => {
			chrome.storage.sync.get('basliklar', data => {
				const { basliklar = [] } = data;

				// engelli basliklarda degilse index -1 olmali?
				const baslikIndex = basliklar.indexOf(baslikStr);
				let ayni_buton = document.querySelector('a#baslik-engellemeli-buton');
				// engelli basliklara ekleyelim.
				if (baslikIndex === -1) {
					const newBasliklar = [...basliklar, baslikStr];
					chrome.storage.sync.set({ basliklar: newBasliklar }, () => {
						ayni_buton.title = 'bu gözler bu başlığı sol framede görse olur artık';
						ayni_buton.innerHTML = 'başlığı engelleme';

						[...solFrameBasliklar_].forEach(solFrameBaslik => {
							const solFrameBaslikStr = solFrameBaslik.innerText.split('\n')[0].trim();
							if (newBasliklar.indexOf(solFrameBaslikStr) !== -1) {
								solFrameBaslik.style.display = 'none';
							}
						});
					});
				}
				// tu kaka basliklardan sil, i.e. engellenmesin artik.
				else {
					const newBasliklar = [...basliklar.slice(0, baslikIndex),
										  ...basliklar.slice(baslikIndex + 1)];
					chrome.storage.sync.set({basliklar: newBasliklar}, () => {
						ayni_buton.title = 'bu başlık sol framede görünmesin lütfen';
						ayni_buton.innerHTML = 'başlığı engelle';

						[...solFrameBasliklar_].forEach(solFrameBaslik => {
							const solFrameBaslikStr = solFrameBaslik.innerText.split('\n')[0].trim();
							if (newBasliklar.indexOf(solFrameBaslikStr) === -1) {
								solFrameBaslik.style.display = 'block';
							}
						});
					});
				}
			});
		});

		block_div.appendChild(block_div_a);
		baslikOptions.appendChild(block_div);
	});
};
