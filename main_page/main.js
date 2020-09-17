const slider = (function(){
	
	const slider = document.getElementById("slider");
	const sliderContent = document.querySelector(".slider-content"); 
	const sliderWrapper = document.querySelector(".slider-content-wrapper"); 
	const elements = document.querySelectorAll(".slider-content__item"); 
	const sliderContentControls = createHTMLElement("div", "slider-content__controls"); 
	let dotsWrapper = null; 
	let prevButton = null; 
	let nextButton = null;
	let autoButton = null;
	let leftArrow = null; 
	let rightArrow = null;
	let intervalId = null;
	
	const itemsInfo = {
		offset: 0,
		position: {
			current: 0, 
			min: 0, 
			max: elements.length - 1 
		},
		intervalSpeed: 2000, 

		update: function(value) {
			this.position.current = value;
			this.offset = -value;
		},
		reset: function() {
			this.position.current = 0;
			this.offset = 0;
		}	
	};

	const controlsInfo = {
		buttonsEnabled: false,
		dotsEnabled: false,
		prevButtonDisabled: true,
		nextButtonDisabled: false
	};

	
	function init(props) {
		let {intervalSpeed, position, offset} = itemsInfo;
		
		if (slider && sliderContent && sliderWrapper && elements) {
			if (props && props.intervalSpeed) {
				intervalSpeed = props.intervalSpeed;
			}
			if (props && props.currentItem) {
				if ( parseInt(props.currentItem) >= position.min && parseInt(props.currentItem) <= position.max ) {
					position.current = props.currentItem;
					offset = - props.currentItem;	
				}
			}
			if (props && props.buttons) {
				controlsInfo.buttonsEnabled = true;
			}
			if (props && props.dots) {
				controlsInfo.dotsEnabled = true;
			}
			
			_updateControlsInfo();
			_createControls(controlsInfo.dotsEnabled, controlsInfo.buttonsEnabled);
			_render();	
		}
	}

	function _updateControlsInfo() {
		const {current, min, max} = itemsInfo.position;
		controlsInfo.prevButtonDisabled = current > min ? false : true;
		controlsInfo.nextButtonDisabled = current < max ? false : true;
	}

	function _createControls(dots = false, buttons = false) {
		
		sliderContent.append(sliderContentControls);

		createArrows();
		buttons ? createButtons() : null;
		dots ? createDots() : null;
		
		function createArrows() {
            const g = document.createElement('div')

			const dValueLeftArrow = g ;
			const dValueRightArrow = "M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z";
			const leftArrowSVG = createSVG(dValueLeftArrow);
			const rightArrowSVG = createSVG(dValueRightArrow);
			
                leftArrow = createHTMLElement("div", "prev-arrow");
			leftArrow.append(leftArrowSVG);
			leftArrow.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current - 1))
			
			rightArrow = createHTMLElement("div", "next-arrow");
			rightArrow.append(rightArrowSVG);
			rightArrow.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current + 1))

			sliderContentControls.append(leftArrow, rightArrow);
			
			function createSVG(dValue, color="currentColor") {
				const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				svg.setAttribute("viewBox", "0 0 256 512");
				const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
				path.setAttribute("fill", color);
				svg.appendChild(path);	
				return "";
			}
		}

		function createDots() {
			dotsWrapper = createHTMLElement("div", "dots");			
			for(let i = 0; i < itemsInfo.position.max + 1; i++) {
				const dot = document.createElement("div");
				dot.className = "dot";
				dot.addEventListener("click", function() {
					updateItemsInfo(i);
				})
				dotsWrapper.append(dot);		
			}
			sliderContentControls.append(dotsWrapper);	
		}
		
		function createButtons() {
			const controlsWrapper = createHTMLElement("div", "slider-controls");
			prevButton = createHTMLElement("button", "prev-control", "Prev");
			prevButton.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current - 1))
			
			autoButton = createHTMLElement("button", "auto-control", "Auto");
			autoButton.addEventListener("click", () => {
				intervalId = setInterval(function(){
					if (itemsInfo.position.current < itemsInfo.position.max) {
						itemsInfo.update(itemsInfo.position.current + 1);
					} else {
						itemsInfo.reset();
					}
					_slideItem();
				}, itemsInfo.intervalSpeed)
			})

			nextButton = createHTMLElement("button", "next-control", "Next");
			nextButton.addEventListener("click", () => updateItemsInfo(itemsInfo.position.current + 1))

		}
	}

	function setClass(options) {
		if (options) {
			options.forEach(({element, className, disabled}) => {
				if (element) {
					disabled ? element.classList.add(className) : element.classList.remove(className)	
				} 
			})
		}
	}

	function updateItemsInfo(value) {
		itemsInfo.update(value);
		_slideItem(true);	
	}

	function _render() {
		const {prevButtonDisabled, nextButtonDisabled} = controlsInfo;
		let controlsArray = [
			{element: leftArrow, className: "d-none", disabled: prevButtonDisabled},
			{element: rightArrow, className: "d-none", disabled: nextButtonDisabled}
		];
		if (controlsInfo.buttonsEnabled) {
			controlsArray = [
				...controlsArray, 
				{element:prevButton, className: "disabled", disabled: prevButtonDisabled},
				{element:nextButton, className: "disabled", disabled: nextButtonDisabled}
			];
		}
		
		setClass(controlsArray);

		sliderWrapper.style.transform = `translateX(${itemsInfo.offset*100}%)`;	
		
		if (controlsInfo.dotsEnabled) {
			if (document.querySelector(".dot--active")) {
				document.querySelector(".dot--active").classList.remove("dot--active");	
			}
			dotsWrapper.children[itemsInfo.position.current].classList.add("dot--active");
		}
	}

	function _slideItem(autoMode = false) {
		if (autoMode && intervalId) {
			clearInterval(intervalId);
		}
		_updateControlsInfo();
		_render();
	}

	function createHTMLElement(tagName="div", className, innerHTML) {
		const element = document.createElement(tagName);
		className ? element.className = className : null;
		innerHTML ? element.innerHTML = innerHTML : null;
		return element;
	}

	return {init};
}())

slider.init({
	currentItem: 0,
	buttons: true,
	dots: true
});

	formReg = document.getElementById("formReg")

	formReg.addEventListener('submit', (e) => {
		e.preventDefault();
		var hr = new XMLHttpRequest();
		// Create some variables we need to send to our PHP file
		var url = "/send.php";
		var summSl = document.getElementById("summSl").value;
		var timeSl = document.getElementById("timeSl").value;
		var fn = document.getElementById("FirstName").value;
		var ln = document.getElementById("SecondName").value;
		var em = document.getElementById("email").value;
		var ph = document.getElementById("tel").value;
		var vars = "FirstName="+fn+"&SecondName="+ln+"&email="+em+"&tel="+ph+"&summSl="+summSl+"&timeSl="+timeSl;
		console.log(vars)
		hr.open("POST", url, true);
		hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		// Access the onreadystatechange event for the XMLHttpRequest object
		hr.onreadystatechange = function() {
			console.log(hr);

			if(hr.readyState == 4 && hr.status == 200) {
				var return_data = hr.responseText;
				document.getElementById("status").innerHTML = return_data;
			}
		}
		// Send the data to PHP now... and wait for response to update the status div

		hr.send(vars); // Actually execute the request
		document.getElementById("status").innerHTML = "processing...";

	})

	
	let email = document.getElementById("email")
	let tel = document.getElementById("tel")
	let step1 = document.getElementById("step1")
	let step2 = document.getElementById("step2")
	let step2Btn = document.getElementById("step2Btn")
	let first_step_back_step1 = document.getElementById("first_step_back_step1")
	let first_step_back_step2 = document.getElementById("first_step_back_step2")
	let first_step_front1 = document.getElementById("first_step_front1")
	let first_step_front2 = document.getElementById("first_step_front2")
	let step1_txt1 = document.getElementById("step1_txt1")
	let step1_txt2 = document.getElementById("step1_txt2")
	let calculator = document.getElementById("calculator")
	let singup = document.getElementById("singup")
	console.log(step1, step2, calculator, singup)

	let summSl11 =document.getElementById("summSl")
	summSl11.addEventListener("mousemove", function sl() {
		let x = summSl11.value
		let color = 'linear-gradient(90deg,  rgb(251, 51, 139)' + x + '%,  rgb(251, 51, 139)'+ x +'%)';
		summSl11.style.background = color;
	})	

	function ValidateEmail() {
	if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.value)){
		return email.style.border = "none", console.log(1)
		}else{
			return email.style.border = "2px solid #FF0000";
		}
	}
	function phone() {
		let phoneno1 = /^\+?3?8?(0(67|68|96|97|98)\d{7})$/;
		let phoneno2 = /^\+?3?8?(0[679]3\d{7})$/;
		let phoneno3= /^\+?3?8?(0(66|95|99)\d{7})$/;
		let phoneno4 = /^\+?3?8?(0[5-9][0-9]\d{7})$/;
		let phoneno5 = /^\+?3?8?(0[3-6][1-8]\d{7})$/;
		let phoneno6 = /^\+?3?8?(0\d{9})$/;
	if(tel.value.match(phoneno1)){
		return tel.style.border = "none"
	}else if(tel.value.match(phoneno2)){
		return tel.style.border = "none"
	}
	else if(tel.value.match(phoneno3)){
		return tel.style.border = "none"
	}
	else if(tel.value.match(phoneno4)){
		return tel.style.border = "none"
	}
	else if(tel.value.match(phoneno5)){
		return tel.style.border = "none"
	}
	else if(tel.value.match(phoneno6)){
		return tel.style.border = "none"
	}else{
		tel.style.border = "2px solid #FF0000";
	}
	  
	}		

	step1.addEventListener("click", () => {
		first_step_back_step1.style.opacity = "0.5";
		first_step_back_step1.style.background = "linear-gradient(-30deg, #7950ac 0%, #4577be 50%, #1ba8d7 100%)";
		first_step_front1.style.background = "linear-gradient(-30deg, #7950ac 0%, #4577be 50%, #1ba8d7 100%)";
		step1_txt1.style.color = "#6a54b4";
		first_step_back_step2.style.background = "#828282";
		first_step_back_step2.style.opacity = "0.3";
		first_step_front2.style.background = "linear-gradient(-30deg, #a6a6a6 0%, #d6d6d6 100%)";
		step1_txt2.style.color = "#b4b3b3";

		calculator.style.display = "block";
		singup.style.display = "none";
	})
	step2Btn.addEventListener("click", ()=> {
		first_step_back_step2.style.opacity = "0.5";
		first_step_back_step2.style.background = "linear-gradient(-30deg, #7950ac 0%, #4577be 50%, #1ba8d7 100%)";
		first_step_front2.style.background = "linear-gradient(-30deg, #7950ac 0%, #4577be 50%, #1ba8d7 100%)";
		step1_txt2.style.color = "#6a54b4";

		first_step_back_step2.style.background = "linear-gradient(-30deg, #7950ac 0%, #4577be 50%, #1ba8d7 100%)";
		first_step_back_step1.style.background = "#828282";
		first_step_back_step1.style.opacity = "0.3";
		first_step_front1.style.background = "linear-gradient(-30deg, #a6a6a6 0%, #d6d6d6 100%)";
		step1_txt1.style.color = "#b4b3b3";

		calculator.style.display = "none";
		singup.style.display = "block";
	})
	step2.addEventListener("click", () => {
		first_step_back_step2.style.opacity = "0.5";
		first_step_back_step2.style.background = "linear-gradient(-30deg, #7950ac 0%, #4577be 50%, #1ba8d7 100%)";
		first_step_front2.style.background = "linear-gradient(-30deg, #7950ac 0%, #4577be 50%, #1ba8d7 100%)";
		step1_txt2.style.color = "#6a54b4";

		first_step_back_step2.style.background = "linear-gradient(-30deg, #7950ac 0%, #4577be 50%, #1ba8d7 100%)";
		first_step_back_step1.style.background = "#828282";
		first_step_back_step1.style.opacity = "0.3";
		first_step_front1.style.background = "linear-gradient(-30deg, #a6a6a6 0%, #d6d6d6 100%)";
		step1_txt1.style.color = "#b4b3b3";

		calculator.style.display = "none";
		singup.style.display = "block";
	})

	
	 

let summ = document.getElementById("summ");
let proz = document.getElementById("proz");
let back = document.getElementById("back");
let msumm = document.getElementById("msumm");
let mtime = document.getElementById("mtime");

function calc() {
	let summSl = parseInt(document.getElementById("summSl").value);
	let timeSl = parseInt(document.getElementById("timeSl").value);

	let q1 = summSl*0.01;
	let q2 = timeSl*2;
	let q4 = q1 + q2;
	let q5= q4 + summSl;
	let q6 = q5 - summSl
	summ.innerHTML = summSl
	back.innerHTML = q5
	proz.innerHTML = q6
	msumm.innerHTML = summSl
	mtime.innerHTML = timeSl
	return console.log(q5) 	
}
calc()


