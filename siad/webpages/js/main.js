function safeSetElem(field, value) {
	var elem = document.getElementById(field)
	if (elem != null) {
		elem.innerHTML = value
	}
}

function safeSetValue(field, value) {
	var elem = document.getElementById(field)
	if (elem != null) {
		elem.defaultValue = value
	}
}

function continuousUpdate() {
	var resp = httpGet("/json/status");
	var stats = JSON.parse(resp);

	safeSetElem('miningStatus', 'Mining Status: ' + stats.Mining);
	safeSetElem('blockStatus',
		'Current Height: ' + stats.StateInfo.Height +
		'<br>Current Target: ' + stats.StateInfo.Target +
		'<br>Current Depth: ' + stats.StateInfo.Depth
	);
	safeSetElem('hostStatus',
		'Host Total Storage: ' + stats.HostSettings.TotalStorage +
		'<br>Host Unsold Storage: ' + stats.HostSpaceRemaining +
		'<br>Host Number of Contracts: ' + stats.HostContractCount
	);

	return stats
}

function updatePage() {
	var stats = continuousUpdate()
	safeSetValue('hostCoinAddress', stats.WalletAddress);

	var rentStatusInnerHTML = ""
	if(stats.RenterFiles != null) {
		for (s in stats.RenterFiles) {
			rentStatusInnerHTML += '<label>' + stats.RenterFiles[s] + '</label>' +
				'<button onclick="downloadFile(\'' + stats.RenterFiles[s] + '\')">Download</button><br>';
		}
	}
	safeSetElem('rentStatus', rentStatusInnerHTML);

	safeSetElem('walletStatus', 'Wallet Balance: ' + stats.WalletBalance + '<br>Wallet Address: ' + stats.WalletAddress);
	safeSetElem('hostNumContracts', stats.HostContractCount)

	safeSetValue('hostIPAddress', stats.HostSettings.IPAddress.Host + ":" + stats.HostSettings.IPAddress.Port)
	// safeSetValue('hostTotalStorage', stats.HostSettings.TotalStorage)
	// safeSetValue('hostUnsoldStorage', stats.HostSpaceRemaining)
	// safeSetValue('hostMinFilesize', stats.HostSettings.MinFilesize)
	// safeSetValue('hostMaxFilesize', stats.HostSettings.MaxFilesize)
	// safeSetValue('hostMinDuration', stats.HostSettings.MinDuration)
	// safeSetValue('hostMaxDuration', stats.HostSettings.MaxDuration)
	// safeSetValue('hostMinWindow', stats.HostSettings.MinChallengeWindow)
	// safeSetValue('hostMaxWindow', stats.HostSettings.MaxChallengeWindow)
	// safeSetValue('hostMinTolerance', stats.HostSettings.MinTolerance)
	// safeSetValue('hostPrice', stats.HostSettings.Price)
	// safeSetValue('hostBurn', stats.HostSettings.Burn)
	// safeSetValue('hostCoinAddress', stats.HostSettings.CoinAddress)
}

function httpGet(url) {
	var xmlHttp = null;
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

function responseBoxGet(url) {
	safeSetElem('apiResponse', httpGet(url));
	updatePage()
}

function sendMoney() {
	var destination = document.getElementById('destinationAddress').value;
	var amount = document.getElementById('amountToSend').value;
	var fee = document.getElementById('minerFee').value;
	var request = "/sendcoins?amount="+amount+"&fee="+fee+"&dest="+destination;
	responseBoxGet(request);
}

function rentFile() {
	var sourceFile = document.getElementById('rentSourceFile').value;
	var nickname = document.getElementById('rentNickname').value;
	responseBoxGet("/rent?sourcefile=" + sourceFile + "&nickname=" + nickname)
}

function hostAnnounce() {
	var address = document.getElementById('hostIPAddress').value;
	var totalstorage = document.getElementById('hostTotalStorage').value;
	var minfile = document.getElementById('hostMinFilesize').value;
	var maxfile = document.getElementById('hostMaxFilesize').value;
	var minduration = document.getElementById('hostMinDuration').value;
	var maxduration = document.getElementById('hostMaxDuration').value;
	var minwin = document.getElementById('hostMinWindow').value;
	var maxwin = document.getElementById('hostMaxWindow').value;
	var mintolerance = document.getElementById('hostMinTolerance').value;
	var price = document.getElementById('hostPrice').value;
	var penalty = document.getElementById('hostBurn').value;
	var coinaddress = document.getElementById('hostCoinAddress').value;
	var freezevolume = document.getElementById('hostFreezeVolume').value;
	var freezeduration = document.getElementById('hostFreezeDuration').value;

	var request = "/host?ipaddress="+address+
		"&totalstorage="+totalstorage+
		"&minfile="+minfile+
		"&maxfile="+maxfile+
		"&minduration="+minduration+
		"&maxduration="+maxduration+
		"&minwin="+minwin+
		"&maxwin="+maxwin+
		"&mintolerance="+mintolerance+
		"&price="+price+
		"&penalty="+penalty+
		"&coinaddress="+coinaddress+
		"&freezevolume="+freezevolume+
		"&freezeduration="+freezeduration;

	responseBoxGet(request);
}

function downloadFile(nick) {
	var dest = "lib/downloads/" + nick;
	// download file
	responseBoxGet("/download?nickname="+nick+"&destination="+dest);
	// prompt for destination
	var downloadLink = document.createElement("a");
	downloadLink.href = dest;
	downloadLink.download = "";
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
