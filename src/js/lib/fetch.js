import reqwest from 'reqwest';

export default function fetchJSON(url) {
	let shouldBeHTTPS = document.location.protocol !== 'http:'

	let fixedUrl = shouldBeHTTPS ? url.replace(/^http:/, 'https:') : url;
	console.log(url);
	var data = 'blah';

	reqwest({
		url: fixedUrl,
		type: 'json',
		contentType: 'application/json',
		crossOrigin: true,
		success: function(resp) { data = resp }
	});

	return data
	console.log(data)
}
