const mockData = [
	{"logo": "", 
	"reiting":"4.6",
	"summCredit": "",
	"percent":"3",
	"return": "",
	"depositValue":"",
	"firstCredit": "",
	"lastCredit": "",
	"time": "",
	},
	{"logo": "", 
	"reiting":"3",
    "summCredit": "",
	"percent":"",
	"return": "",
	"depositValue":"",
	"firstCredit": "",
	"lastCredit": "",
	"time": "",
	},
	{"logo": "", 
	"reiting":"5",
	"summCredit": "",
	"percent":"",
	"return": "",
	"depositValue":"",
	"firstCredit": "",
	"lastCredit": "",
	"time": "",
	}
]

function createSeries(datarecord, summ = 1) {
	return `
	<div>
	<h2 class="a-Series_Title">${parseInt(datarecord.reiting)*summ}</h2>
	  <p class="a-Series_Description">
		<span class="a-Series_DescriptionHeader">Description: </span>${datarecord.percent}
	  </p>
	  <div class="a-EpisodeBlock">
		<h4 class="a-EpisodeBlock_Title">First episodes</h4>
	  </div>
	</div>  
	`;
  }
	
	document.getElementById("btn").addEventListener("click", () => {
		renderCreditItems(mockData, 2)
		console.log("click")
	})

function renderCreditItems(mockData, summ, month) {
	if(mockData.length === 0) return false
	const creditItems = document.getElementById('creditItems')
	const templeit = mockData.map(element => {
	return createSeries(element, summ)
	}).join("")	
	console.log(typeof creditItems)
	creditItems.innerHTML = templeit
	console.log(templeit)
}
renderCreditItems(mockData);


